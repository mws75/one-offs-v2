import { LuThumbsUp } from "react-icons/lu";
import { MdThumbUp } from "react-icons/md";
import { api } from "../utils/api";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";

type content = {
  id: number;
  user_id: string;
  post_id: number;
  liked: number;
};

export const PostObject = (props: content) => {
  const user = useUser();
  const initialLike = props.liked;
  const [isLiked, setIsLiked] = useState(initialLike);

  const createLikeMutation = api.likedPosts.create.useMutation({
    onSuccess: () => {
      setIsLiked(1);
      alert("Post Liked!");
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const deleteLikeMutation = api.likedPosts.delete.useMutation({
    onSuccess: () => {
      setIsLiked(0);
      alert("Like Removed!");
    },
    onError: (error) => {
      console.log(error);
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

  return (
    <div className="relative">
      <div className="absolute bottom-10 left-10">
        <button
          className="absolute right-0 top-0 flex flex-row p-2"
          onClick={() => likedClicked(user.id, props.id)}
        >
          {isLiked === 1 ? <MdThumbUp size={20} /> : <LuThumbsUp size={20} />}
        </button>
      </div>
    </div>
  );
};

export default PostObject;
