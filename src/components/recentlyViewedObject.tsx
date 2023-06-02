import { api, RouterOutputs } from "../utils/api";
import Link from "next/link";
import Image from "next/image";
import default_profile_pic from "../../public/default_profile_pic.png";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { LoadingPage } from "./loadingspinner";

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
  if (!user) return null;

  const profile_image_url = user?.profileImageUrl;
  const user_profile = useUserProfile(user.id);

  //   console.log(recently_viewed_json);
  if (user_profile.isLoading) {
    return <LoadingPage />;
  }

  const recentPostsJson = JSON.parse(
    String(user_profile.data?.recent_posts_json)
  );

  console.log(recentPostsJson);

  return (
    <>
      <div className="m-4 flex h-40 w-11/12 flex-row items-center rounded-lg bg-slate-100 p-4 shadow-md hover:bg-slate-300">
        <div className="float-left">
          <Image
            src={profile_image_url ? profile_image_url : default_profile_pic}
            alt={"profile_pic"}
            width={120}
            height={120}
            className="rounded-full"
          />
        </div>
        <div className="ml-4 flex-grow justify-center">
          <ul>
            {recentPostsJson.map((item: recentPosts) => (
              <li key={item.id}>{item.title}</li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};
