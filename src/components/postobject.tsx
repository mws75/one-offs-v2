import { RouterOutputs } from "../utils/api";
import Link from "next/link";
import Image from "next/image";
import default_profile_pic from "../../public/default_profile_pic.png";
import {
  IoIosCopy,
  IoIosCheckmarkCircleOutline,
  IoIosThumbsUp,
} from "react-icons/io";
import { LuThumbsUp } from "react-icons/lu";
import { MdThumbUp } from "react-icons/md";
import { IoThumbsUpOutline } from "react-icons/io5";
import { api } from "../utils/api";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { initScriptLoader } from "next/script";

// [number] grabs a single element from the array so we can create a type of posts[0].
type postedContent = {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  user_name: string;
  post: string;
  title: string;
  profile_image_url: string | null;
  liked: number;
};
type likedFlag = number;

export const PostObject = (props: postedContent) => {
  const { id, title, profile_image_url } = props;
  const my_id = id.toString();
  const { user } = useUser();
  if (!user)
    return (
      <div>
        <p>401 Please Login</p>
      </div>
    );

  const user_id = user?.id;

  const [isLiked, setIsLiked] = useState(props.liked);

  useEffect(() => {
    setIsLiked(props.liked);
  }, [props.liked]);

  const createLikeMutation = api.likedPosts.create.useMutation({
    onSuccess: () => {
      setIsLiked(1);
      alert("Post Liked!");
    },
    onError: (error) => {
      const errorMessage = error.data?.zodError?.fieldErrors.content;
      if (errorMessage && errorMessage[0]) {
        alert(errorMessage[0]);
      } else {
        alert("Something went wrong, failed to like." + String(error));
      }
    },
  });

  const deleteLikeMutation = api.likedPosts.delete.useMutation({
    onSuccess: () => {
      setIsLiked(0);
      alert("Like Removed!");
    },
    onError: (error) => {
      const errorMessage = error.data?.zodError?.fieldErrors.content;
      if (errorMessage && errorMessage[0]) {
        alert(errorMessage[0]);
      } else {
        alert("Something went wrong, failed to unlike." + String(error));
      }
    },
  });

  const likedClicked = (user_id: string, post_id: number) => {
    if (isLiked === 1) {
      deleteLikeMutation.mutate({
        user_id: user_id,
        post_id: post_id,
      });
    } else {
      createLikeMutation.mutate({
        user_id: user_id,
        post_id: post_id,
      });
    }
  };

  const pic_url = profile_image_url || default_profile_pic;

  return (
    <div className="relative">
      <Link href={`/post/${my_id}`}>
        <div className="flex min-h-[8rem] w-full flex-col rounded-lg bg-slate-100 p-3 pb-10 shadow-md hover:bg-slate-300">
          <span className="line-clamp-3 text-sm font-medium leading-snug sm:text-base">
            {title}
          </span>
        </div>
      </Link>

      {/* Profile image – bottom right */}
      <div className="absolute bottom-3 right-3">
        <Image
          src={pic_url}
          alt={"profile"}
          width={28}
          height={28}
          className="rounded-full border border-black"
        />
      </div>

      {/* Like button – bottom left */}
      <button
        className="absolute bottom-2 left-2 flex items-center rounded p-1 hover:bg-slate-200"
        onClick={() => likedClicked(user_id, props.id)}
        aria-label={isLiked === 1 ? "Unlike post" : "Like post"}
      >
        {isLiked === 1 ? <MdThumbUp size={20} /> : <LuThumbsUp size={20} />}
      </button>
    </div>
  );
};

export default PostObject;
