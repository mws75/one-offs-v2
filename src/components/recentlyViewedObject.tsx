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

// Custom hook to get recently viewed posts.
const useUserProfile = (userId: string) => {
  const { data } = api.profile.getById.useQuery({
    id: String(userId),
  });
  return { data };
};

export const RecentlyViewedObject = () => {
  const { user } = useUser();
  if (!user) return null;

  const profile_image_url = user?.profileImageUrl;
  const { data: user_profile } = useUserProfile(user.id);
  const [recentPostsJson, setRecentPostsJson] = useState<Item[] | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        const recent_posts_json = user_profile?.recent_posts_json;
        setRecentPostsJson(JSON.parse(String(recent_posts_json)));
        setIsProfileLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    if (recentPostsJson === null) {
      getData();
    }
  });

  //   console.log(recently_viewed_json);
  if (isProfileLoading) {
    return <LoadingPage />;
  }

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
          {recentPostsJson &&
            recentPostsJson.map((post) => <div key={post.id}>{post.id}</div>)}
        </div>
      </div>
    </>
  );
};
