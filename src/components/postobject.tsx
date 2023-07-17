import { RouterOutputs } from "../utils/api";
import Link from "next/link";
import Image from "next/image";
import default_profile_pic from "../../public/default_profile_pic.png";

// [number] grabs a single element from the array so we can create a type of posts[0].
type postedContent = RouterOutputs["posts"]["getAll"][number];

export const PostObject = (props: postedContent) => {
  const { id, title, profile_image_url } = props;
  const my_id = id.toString();

  const pic_url = profile_image_url || default_profile_pic;

  return (
    <Link href={`/post/${my_id}`}>
      <span className="relative">
        <div className="w-120 h-40 w-64 rounded-lg bg-slate-100 p-4 shadow-md hover:bg-slate-300">
          {title}``
          <div className="absolute bottom-3 right-3">
            <Image
              src={pic_url}
              alt={"profile"}
              width={32}
              height={32}
              className="border-1 ml-1 rounded-full border-black"
            />
          </div>
        </div>
      </span>
    </Link>
  );
};

export default PostObject;
