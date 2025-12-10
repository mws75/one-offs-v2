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
  //   console.log(recently_viewed_json);
  if (user_profile.isLoading) {
    return <LoadingPage />;
  }
  console.log("============ User Profile Debug =============");
  console.log("user.id: ", user.id);
  console.log("user_profile.isLoading: ", user_profile.isLoading);
  console.log("user_profile.isError: ", user_profile.isError);
  console.log("user_profile.error: ", user_profile.error);
  console.log("user_profile.data: ", user_profile.data);

  const recentPostsJson = user_profile.data?.recent_posts_json
    ? JSON.parse(String(user_profile.data.recent_posts_json))
    : [];

  return (
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
                className="m-2 justify-items-center rounded-full border-2 border-solid border-slate-600"
              />
            </span>
          </Link>
        </div>

        <div className="col-span-4">
          <ul>
            {recentPostsJson.map((item: recentPosts) => (
              <Link href={`/post/${item.id}`}>
                <li
                  key={item.id}
                  className="border-slate m-2 ml-4 rounded-lg border-2 border-solid bg-slate-100 p-2 hover:bg-slate-300"
                >
                  <span className="relative">{item.title}</span>
                </li>
              </Link>
            ))}
          </ul>
        </div>
        <div className="col-span-1 m-2">
          <Link href={`/about`}>
            <span>
              <Image
                src={logo}
                alt={"shark"}
                layout="responsive"
                height={120}
                width={120}
              />
            </span>
          </Link>
        </div>

        <div className="col-span-1 m-4"></div>
      </div>
    </>
  );
};
