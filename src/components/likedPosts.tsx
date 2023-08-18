import { api, RouterOutputs } from "../utils/api";
import Link from "next/link";
import Image from "next/image";
import default_profile_pic from "../../public/default_profile_pic.png";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { LoadingPage } from "./loadingspinner";
import { set } from "zod";

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

  console.log(likedPosts);

  return (
    <>
      <div>
        <p>Liked Posts</p>
      </div>
      <div className="m-4 flex w-11/12  items-center rounded-lg bg-slate-100 shadow-md">
        <ul>
          {!likedPosts ? (
            <li>you haven't liked any posts yet!</li>
          ) : (
            likedPosts.map((likedPost: LikedPost) => {
              return (
                <li key={likedPost.id}>
                  <div className="flex flex-col items-center">
                    <Link href={`/post/${likedPost.post.id}`}>
                      <p className="text-lg font-semibold">
                        {likedPost.post.title}
                      </p>
                    </Link>
                  </div>
                </li>
              );
            })
          )}
        </ul>
      </div>
    </>
  );
};

export default LikedPostsSection;
