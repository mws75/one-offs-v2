import { api, RouterOutputs } from "../utils/api";
import Link from "next/link";
import Image from "next/image";
import default_profile_pic from "../../public/default_profile_pic.png";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { LoadingPage } from "./loadingspinner";
import LikedHeart from "../../public/LikedHeart.png";

type LikedPost = RouterOutputs["financePosts"]["getAllLikedPosts"][0];

const FinanceLikedPostsSection = () => {
  const { user } = useUser();
  if (!user) return null;

  const { data: initialLikedPosts, isLoading: likedPostsLoading } =
    api.financePosts.getAllLikedPosts.useQuery();

  const [likedPosts, setLikedPosts] = useState(initialLikedPosts);

  useEffect(() => {
    setLikedPosts(initialLikedPosts);
  }, [initialLikedPosts]);

  if (!likedPosts || likedPostsLoading) return <LoadingPage />;

  return (
    <>
      <div className="m-4 w-11/12 items-center rounded-lg bg-slate-100 shadow-md">
        <div className="flex items-center px-5 pt-5">
          <Image src={LikedHeart} alt="liked heart" width={40} height={40} />
          <h3 className="p-2">Liked Finance Posts</h3>
          <Image src={LikedHeart} alt="liked heart" width={40} height={40} />
        </div>
        <div className="py-5">
          <ul>
            {likedPosts.length === 0 ? (
              <li className="m-5">you haven&apos;t liked any finance posts yet!</li>
            ) : (
              likedPosts.map((likedPost: LikedPost) => {
                const pic_url = likedPost.post.profile_image_url || default_profile_pic;
                return (
                  <Link href={`/finance/post/${likedPost.post.id}`} key={likedPost.id}>
                    <li className="border-slate m-2 ml-4 flex w-96 rounded-lg border-2 border-solid bg-slate-100 p-2 hover:bg-[#e8f5ef]">
                      <div className="flex w-96 items-center justify-between">
                        <p>{likedPost.post.title}</p>
                        <Image
                          src={pic_url}
                          alt="profile image"
                          width={30}
                          height={30}
                          className="border-1 rounded-full border-solid border-slate-600"
                        />
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

export default FinanceLikedPostsSection;
