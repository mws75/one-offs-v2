import { SignIn } from "@clerk/nextjs";
import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { LoadingPage } from "~/components/loadingspinner";

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

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="bg-gradient-to-r from-purple-300 to-pink-200">
        <PageLayout>
          <div className="flex">
            {!isSignedIn && (
              <div className="flex h-screen items-center justify-center">
                <div>
                  <Image className=" max-w-xl" src={logo} alt="Logo" />
                </div>
                <div className="flex flex-col items-center justify-center">
                  <div className="justify-center rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700">
                    <SignInButton />
                  </div>
                  <Link href="/about">
                    <button className="m-5 rounded bg-blue-500 p-4 px-4 py-2 font-bold text-white hover:bg-blue-700">
                      About
                    </button>
                  </Link>
                </div>
              </div>
            )}
          </div>
          {isSignedIn && (
            <div>
              <div className="flex flex-wrap">
                <RecentlyViewedObject />
                <PostFeed />
              </div>

              <div className="flex">
                <Link href={`/newPost`}>
                  <button className="m-5 rounded bg-purple-500 p-4 px-4 py-2 font-bold text-white hover:bg-purple-700">
                    Createt New Post
                  </button>
                </Link>

                <div className="my-5 w-32 rounded bg-pink-400 p-4  py-2 font-bold text-white hover:bg-pink-700">
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
