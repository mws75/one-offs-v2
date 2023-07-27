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
import { useState } from "react";
import { useUser } from "@clerk/nextjs";

// [number] grabs a single element from the array so we can create a type of posts[0].
type postedContent = RouterOutputs["posts"]["getAll"][number];

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

  const [isLiked, setIsLiked] = useState(false);

  const { mutate, isLoading: isLiking } = api.likedPosts.create.useMutation({
    onSuccess: () => {
      setIsLiked(true);
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
          onClick={() =>
            mutate({
              user_id: user_id,
              post_id: props.id,
            })
          }
        >
          {isLiked === true ? (
            <MdThumbUp size={20} />
          ) : (
            <LuThumbsUp size={20} />
          )}
        </button>
      </div>
    </div>
  );
};

export default PostObject;
