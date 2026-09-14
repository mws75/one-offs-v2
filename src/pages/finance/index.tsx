import {
  SignInButton,
  SignUpButton,
  SignOutButton,
  useUser,
} from "@clerk/nextjs";
import { LoadingPage } from "~/components/loadingspinner";
import { api } from "~/utils/api";
import { type NextPage } from "next";
import Head from "next/head";
import { PageLayout } from "~/components/layouts";
import Link from "next/link";
import { FinanceRecentlyViewedObject } from "~/components/financeRecentlyViewedObject";
import FinancePostFeed from "~/components/financePostFeed";
import logo from "../../../public/ByteSizeTechLogo.png";
import Image from "next/image";

const FinanceHome: NextPage = () => {
  const { isLoaded: userLoaded, isSignedIn, user } = useUser();

  if (!userLoaded) return <LoadingPage />;

  const { data: currentUser } = api.profile.getCurrentUser.useQuery(undefined, {
    enabled: isSignedIn,
  });
  const isAdmin = currentUser?.is_admin ?? false;

  return (
    <>
      <Head>
        <title>Byte Size Finance</title>
        <meta name="description" content="Short-form finance articles" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="bg-gradient-to-r from-[#c5e7e2] to-[#a1cda8]">
        <PageLayout>
          <div className="flex">
            {!isSignedIn && (
              <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 sm:flex-row sm:gap-8">
                <div>
                  <Image
                    className="w-64 max-w-full sm:w-96 md:w-[32rem] lg:w-[36rem]"
                    src={logo}
                    alt="Logo"
                  />
                  <h1 className="mt-4 text-3xl font-bold text-[#627264]">Byte Size Finance</h1>
                  <p className="mt-2 text-[#4f5d51]">Short-form finance articles.</p>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <div className="flex justify-center items-center rounded bg-[#a1cda8] px-4 py-2 font-bold text-white hover:bg-[#627264] mb-4 h-12 w-24">
                    <SignUpButton>
                      <button>Sign Up</button>
                    </SignUpButton>
                  </div>
                  <div className="flex justify-center items-center rounded bg-[#627264] px-4 py-2 font-bold text-white hover:bg-[#4f5d51] mb-4 h-12 w-24">
                    <SignInButton>
                      <button>Sign In</button>
                    </SignInButton>
                  </div>
                  <Link href="/">
                    <button className="m-5 rounded bg-purple-500 p-4 px-4 py-2 font-bold text-white hover:bg-purple-700">
                      Tech
                    </button>
                  </Link>
                </div>
              </div>
            )}
          </div>
          {isSignedIn && (
            <div>
              <div className="flex flex-wrap">
                <FinanceRecentlyViewedObject />
                <FinancePostFeed />
              </div>
              <div className="flex mx-5">
                {isAdmin && (
                  <Link href="/finance/newPost">
                    <button className="my-5 mr-5 rounded bg-[#627264] p-4 px-4 py-2 font-bold text-white hover:bg-[#4f5d51]">
                      Create New Post
                    </button>
                  </Link>
                )}
                <Link href="/">
                  <button className="my-5 mr-5 rounded bg-purple-500 p-4 px-4 py-2 font-bold text-white hover:bg-purple-700">
                    Tech
                  </button>
                </Link>
                <div className="my-5 w-32 rounded bg-[#a1cda8] p-4 py-2 font-bold text-white hover:bg-[#627264]">
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

export default FinanceHome;
