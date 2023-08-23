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

  console.log(likedPosts);

  return (
    <>
      <div className="m-4  w-11/12  items-center rounded-lg bg-slate-100 shadow-md">
        <div className="p-5">
          {/* <Image src={LikedHeart} alt="liked heart"></Image>
           */}
          <p>Liked Posts</p>
        </div>

        <div className="py-5">
          <ul>
            {!likedPosts ? (
              <li>you haven't liked any posts yet!</li>
            ) : (
              likedPosts.map((likedPost: LikedPost) => {
                return (
                  <Link href={`/post/${likedPost.post.id}`}>
                    <li
                      key={likedPost.id}
                      className="border-slate
                      m-2
                      ml-4
                      flex
                      w-96
                      rounded-lg
                      border-2
                      border-solid
                      bg-slate-100
                      p-2
                      hover:bg-slate-300"
                    >
                      <div className="flex flex-col items-center">
                        <p>{likedPost.post.title}</p>
                      </div>
                    </li>
                  </Link>
                );
              })
            )}
          </ul>
        </div>
      </div>
    </>
  );
};

export default LikedPostsSection;
