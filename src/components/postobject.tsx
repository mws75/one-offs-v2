import { RouterOutputs } from "../utils/api";
import Link from "next/link";
import Image from "next/image";
import default_profile_pic from "../../public/default_profile_pic.png";
import {
  IoIosCopy,
  IoIosCheckmarkCircleOutline,
  IoIosThumbsUp,
} from "react-icons/io";
import { IoThumbsUpOutline } from "react-icons/io5";

// [number] grabs a single element from the array so we can create a type of posts[0].
type postedContent = RouterOutputs["posts"]["getAll"][number];

export const PostObject = (props: postedContent) => {
  const { id, title, profile_image_url } = props;
  const my_id = id.toString();

  const likeClicked = () => {
    alert("Liked!");
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
          onClick={() => likeClicked()}
        >
          <IoThumbsUpOutline size={20} />
        </button>
      </div>
    </div>
  );
};

export default PostObject;
