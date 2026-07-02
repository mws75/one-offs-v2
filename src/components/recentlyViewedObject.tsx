import { api, RouterOutputs } from "../utils/api";
import Link from "next/link";
import Image from "next/image";
import default_profile_pic from "../../public/default_profile_pic.png";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { LoadingPage } from "./loadingspinner";
import sharkImage from "../../public/whale-shark-cartoon-pixel-1.png";
import logo from "../../public/ByteSizeTechLogo.png";
// TODO Makes the items links to the pages.

interface Item {
  id: number;
}

interface recentPosts {
  id: number;
  title: string;
}

// Custom hook to get recently viewed posts.
const useUserProfile = (userId: string) => {
  const { data, isError, isLoading, error } = api.profile.getById.useQuery({
    id: String(userId),
  });
  return { data, isError, isLoading, error };
};

export const RecentlyViewedObject = () => {
  const { user } = useUser();

  if (!user)
    return (
      <div>
        <p>401 Please Login</p>
      </div>
    );

  const profile_image_url = user?.profileImageUrl;
  const user_profile = useUserProfile(user.id);

  if (user_profile.isLoading) {
    return <LoadingPage />;
  }

  const recentPostsJson = user_profile.data?.recent_posts_json
    ? JSON.parse(String(user_profile.data.recent_posts_json))
    : [];

  return (
<<<<<<< HEAD
    <div className="m-2 rounded-lg bg-slate-100 shadow-md sm:m-4">
      <div className="flex items-center gap-3 p-3 sm:gap-4 sm:p-4">

        {/* Profile picture – links to user profile */}
        <Link href="/userProfile" className="flex-shrink-0">
          <Image
            src={profile_image_url ? profile_image_url : default_profile_pic}
            alt={"profile_pic"}
            width={56}
            height={56}
            className="h-14 w-14 rounded-full border-2 border-solid border-slate-600 sm:h-20 sm:w-20"
          />
        </Link>

        {/* Recently viewed list – grows to fill available space */}
        <div className="min-w-0 flex-1">
          {recentPostsJson.length === 0 ? (
            <p className="text-xs text-slate-500 sm:text-sm">
              No recently viewed posts
            </p>
          ) : (
            <ul className="space-y-1">
              {recentPostsJson.map((item: recentPosts) => (
                <Link href={`/post/${item.id}`} key={item.id}>
                  <li className="truncate rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs hover:bg-slate-300 sm:text-sm">
                    {item.title}
                  </li>
                </Link>
              ))}
            </ul>
          )}
=======
    <>
      <div className=" h-min-35 m-4 grid w-11/12 grid-cols-6 items-center rounded-lg  bg-slate-100 shadow-md">
        <div className="col-span-1 m-2 justify-items-center">
          <Link href={`/userProfile`}>
            <span>
              <Image
                src={
                  profile_image_url ? profile_image_url : default_profile_pic
                }
                alt={"profile_pic"}
                width={120}
                height={120}
                className="m-2 h-14 w-14 justify-items-center rounded-full border-2 border-solid border-slate-600 sm:h-auto sm:w-auto"
              />
            </span>
          </Link>
>>>>>>> old-style-mobile
        </div>

        {/* Logo – links to about page */}
        <Link href="/about" className="flex-shrink-0">
          <Image
            src={logo}
            alt={"ByteSizeTech Logo"}
            width={56}
            height={56}
            className="h-14 w-14 sm:h-20 sm:w-20"
          />
        </Link>
      </div>
    </div>
  );
};
