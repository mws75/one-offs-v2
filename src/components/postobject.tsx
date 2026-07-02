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
        <span>
          <div className="w-120 h-40 w-64 rounded-lg bg-slate-100 p-4 shadow-md hover:bg-slate-300">
            {title}
          </div>
        </span>
      </Link>
      <div className="absolute bottom-3 right-3">
        <Image
          src={pic_url}
          alt={"profile"}
          width={32}
          height={32}
          className="border-1 ml-1 rounded-full border-black"
        />
      </div>
      <div className="absolute bottom-10 left-10">
        <button
          className="absolute right-0 top-0 flex flex-row p-2"
          onClick={() => likedClicked(user_id, props.id)}
        >
          {isLiked === 1 ? <MdThumbUp size={20} /> : <LuThumbsUp size={20} />}
        </button>
      </div>
    </div>
  );
};

export default PostObject;
