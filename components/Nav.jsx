"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { signIn, signOut, useSession, getProviders } from "next-auth/react";

const Nav = () => {
  const userLoggedIn = true;
  const [providers, setProviders] = useState(null);

  useEffect(() => {
    const setProviders = async () => {
      const response = await getProviders();
      setProviders(response)
    }
    setProviders();
  }, []);

  return (
    <nav className="flex-between w-full mb-16 pt-3">
      <Link href="/" className="flex gap-2 flex-center">
        <Image
          src="/assets/images/logo.svg"
          alt="Searching Next Logo"
          width={30}
          height={30}
          className="object-contain"
        />

        <p className="logo_text">Searching Next</p>
      </Link>

      {/* Desktop Navigation*/}

      <div className="sm:flex hidden">
        {userLoggedIn ? (
          <div className="flex gap-3 md:gap-5">
            <Link href="/create-prompt" className="black_btn">
              Create Post
            </Link>
            <button type="button" onClick={signOut} className="outline_btn">
              Sing Out
            </button>
            <Link href="/profile" className="">
              <Image
                src="assets/images/logo.svg"
                className="rounded-full"
                width={37}
                height={37}
                alt="profile"
              />
            </Link>
          </div>
        ) : (
          <>
            {providers && Object.values(providers).map(provider => (
              <button
                type="button"
                key={provider.name}
                onClick={() => signIn(provider.id)}
                className="black_btn"
              >
                Sign In
              </button>
            ))}
          </>
        )}
      </div>
    </nav>
  );
};

export default Nav;
