import { NextPage } from "next";
import { useRouter } from "next/router";
import ReactMarkdown from "react-markdown";
import { api, RouterOutputs } from "~/utils/api";
import { profileRouter } from "../../server/api/routers/profile";
import Link from "next/link";
import { udpatedRecentlyViewedJson } from "../../server/helpers/dataHelper";
import { useUser } from "@clerk/nextjs";

const SinglePagePost = () => {
  const router = useRouter();
  const { id } = router.query;
  let num_id = Number(id);
  const { user } = useUser()!;

  const { data } = api.posts.getById.useQuery({
    id: num_id,
  });

  // const sample_json = `[{"id": 1}, {"id": 2}, {"id": 3}]`;
  // const { mutate } = api.profile.updateRecentlyViewed.useMutation({
  //   content: sample_json
  // });

  if (!data) return <div>{`404 and id: ${id}`}</div>;

  return (
    <>
      <div className="m-5 text-center">
        <h1>
          <ReactMarkdown className="prose">{`#  ${data.title}`}</ReactMarkdown>
        </h1>
      </div>
      <div className="m-5">
        <ReactMarkdown className="prose">{data.post}</ReactMarkdown>
        <Link href="/">
          <button className="mt-5 rounded bg-blue-500 p-4 px-4 py-2 font-bold text-white hover:bg-blue-700">
            home
          </button>
        </Link>
      </div>
    </>
  );
};

export default SinglePagePost;