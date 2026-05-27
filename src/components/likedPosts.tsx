import { api, RouterOutputs } from "../utils/api";
import Link from "next/link";
import Image from "next/image";
import default_profile_pic from "../../public/default_profile_pic.png";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { LoadingPage } from "./loadingspinner";

import LikedHeart from "../../public/LikedHeart.png";

type LikedPost = RouterOutputs["posts"]["getAllLikedPosts"][0];

const LikedPostsSection = () => {
  const { user } = useUser();
  if (!user) return null;

  const { data: initialLikedPosts, isLoading: likedPostsLoading } =
    api.posts.getAllLikedPosts.useQuery();

  const [likedPosts, setLikedPosts] = useState(initialLikedPosts);

  useEffect(() => {
    setLikedPosts(initialLikedPosts);
  }, [initialLikedPosts]);

  if (!likedPosts || likedPostsLoading) {
    return <LoadingPage />;
  }

  return (
    <div className="m-2 rounded-lg bg-slate-100 shadow-md sm:m-4">
      {/* Section header */}
      <div className="flex items-center gap-2 px-4 pt-4">
        <Image src={LikedHeart} alt="liked heart" width={32} height={32} />
        <h3 className="text-sm font-semibold sm:text-base">Liked Posts</h3>
        <Image src={LikedHeart} alt="liked heart" width={32} height={32} />
      </div>

      {/* Liked posts list */}
      <ul className="p-3 sm:p-4">
        {likedPosts.length === 0 ? (
          <li className="py-2 text-sm text-slate-500">
            You haven't liked any posts yet!
          </li>
        ) : (
          likedPosts.map((likedPost: LikedPost) => {
            const pic_url =
              likedPost.post.profile_image_url || default_profile_pic;
            return (
              <Link href={`/post/${likedPost.post.id}`} key={likedPost.id}>
                <li className="mb-2 flex w-full items-center justify-between rounded-lg border border-slate-300 bg-white p-2 hover:bg-slate-300">
                  <p className="mr-2 min-w-0 flex-1 truncate text-sm">
                    {likedPost.post.title}
                  </p>
                  <Image
                    src={pic_url}
                    alt="profile image"
                    width={28}
                    height={28}
                    className="flex-shrink-0 rounded-full border border-slate-600"
                  />
                </li>
              </Link>
            );
          })
        )}
      </ul>
    </div>
  );
};

export default LikedPostsSection;
