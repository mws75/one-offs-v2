import { RouterOutputs } from "../utils/api";
import Link from "next/link";

// [number] grabs a single element from the array so we can create a type of posts[0].
type postedContent = RouterOutputs["posts"]["getAll"][number];

export const PostObject = (props: postedContent) => {
  const { id, title } = props;
  const my_id = id.toString();
  return (
    <Link href={`/post/${my_id}`}>
      <span>
        <div className="w-120 mb-5 h-40 w-72 rounded-lg bg-slate-100 p-4 shadow-md hover:bg-slate-300">
          {title} and Id:
          {id}
        </div>
      </span>
    </Link>
  );
};

export default PostObject;
