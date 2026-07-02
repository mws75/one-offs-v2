import { SignIn } from "@clerk/nextjs";
import {
  SignInButton,
  SignUpButton,
  SignOutButton,
  useUser,
} from "@clerk/nextjs";
import { LoadingPage } from "~/components/loadingspinner";
import { api } from "../utils/api";
import { type NextPage } from "next";
import Head from "next/head";
import { PageLayout } from "~/components/layouts";
import Link from "next/link";

import { RecentlyViewedObject } from "~/components/recentlyViewedObject";
import background_img from "../../public/background_img.jpeg";
import default_profile_pic from "../../public/default_profile_pic.png";
import SearchBar from "~/components/searchBar";
import PostFeed from "~/components/postFeed";
import logo from "../../public/ByteSizeTechLogo.png";
import Image from "next/image";

// TODO

const Home: NextPage = () => {
  const { isLoaded: userLoaded, isSignedIn, user } = useUser();

  if (!userLoaded) {
    return <LoadingPage />;
  }
  const { data: currentUser } = api.profile.getCurrentUser.useQuery(undefined, {
    enabled: isSignedIn,
  });
  console.log("Current User... ");
  console.log(currentUser);
  const isAdmin = currentUser?.is_admin ?? false;
  return (
    <>
      <Head>
        <title>Byte-Size-Tech</title>
        <meta name="description" content="Short and sweet tech blog posts" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-r from-purple-300 to-pink-200">
        <PageLayout>
<<<<<<< HEAD
=======
          <div className="flex">
            {!isSignedIn && (
              <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 sm:flex-row sm:gap-8">
                <div>
                  <Image
                    className="w-64 max-w-full sm:max-w-xl"
                    src={logo}
                    alt="Logo"
                  />
                </div>
                <div className="flex flex-col items-center justify-center">
                  <div className="flex justify-center items-center rounded bg-pink-500 px-4 py-2 font-bold text-white hover:bg-pink-700 mb-4 h-12 w-24">
                    <SignUpButton>
                      <button>Sign Up</button>
                    </SignUpButton>
                  </div>
>>>>>>> old-style-mobile

          {/* ── Signed-out landing ── */}
          {!isSignedIn && (
            <div className="flex min-h-screen flex-col items-center justify-center gap-8 px-6 sm:flex-row sm:gap-12">
              {/* Logo */}
              <div className="flex justify-center">
                <Image
                  className="w-40 max-w-full sm:w-64 md:max-w-sm"
                  src={logo}
                  alt="ByteSizeTech Logo"
                  priority
                />
              </div>

              {/* Auth buttons */}
              <div className="flex flex-col items-center gap-3">
                <SignUpButton>
                  <button className="flex h-12 w-36 items-center justify-center rounded bg-pink-500 font-bold text-white hover:bg-pink-700">
                    Sign Up
                  </button>
                </SignUpButton>

                <SignInButton>
                  <button className="flex h-12 w-36 items-center justify-center rounded bg-blue-500 font-bold text-white hover:bg-blue-700">
                    Sign In
                  </button>
                </SignInButton>

                <Link href="/about">
                  <button className="flex h-12 w-36 items-center justify-center rounded bg-blue-500 font-bold text-white hover:bg-blue-700">
                    About
                  </button>
                </Link>
              </div>
            </div>
          )}

          {/* ── Signed-in feed ── */}
          {isSignedIn && (
            <div className="flex flex-col pb-6">
              {/* Recently viewed header */}
              <RecentlyViewedObject />

              {/* Post feed */}
              <div className="mt-2">
                <PostFeed />
              </div>

              {/* Action buttons */}
              <div className="mt-4 flex flex-wrap gap-3 px-2 sm:px-4">
                {isAdmin && (
                  <Link href="/newPost">
                    <button className="flex h-11 items-center rounded bg-purple-500 px-5 font-bold text-white hover:bg-purple-700">
                      Create New Post
                    </button>
                  </Link>
                )}
                <div className="flex h-11 items-center rounded bg-pink-400 px-5 font-bold text-white hover:bg-pink-700">
                  <SignOutButton />
                </div>
              </div>
            </div>
          )}

        </PageLayout>
      </div>
    </>
  );
};

export default Home;
