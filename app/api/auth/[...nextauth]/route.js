import { connectToDB } from "@utils/database";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import User from "@models/user";



const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        })
    ],
    async session({ session }) {

        // store the user id from MongoDB to session
        const sessionUser = await User.findOne({
            email : session.user.email
        })

        // Updating the session user id with user
        session.user.id = sessionUser._id.toString();

        // Making sure which user in Online
        return session;

    },
    async signIn({ profile }) {
        try {
            // serverless => lambda => dynamodb
            
            await connectToDB();

            // Check if the user is already exists
            const userExists = await User.findOne({
                email : profile.email,
            });

            // If not, create a new User
            if(!userExists){
                await User.create({
                    email : profile.email,
                    username : profile.name.replace(" ", "").toLowerCase(),
                    image : profile.picture,
                })
            }

            return true;

        } catch (error) {
            console.error(error);
            console.log(error);

            return false;
        }
    },
})

export { handler as GET, handler as POST };