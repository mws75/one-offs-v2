import { NextPage } from "next";
import { useRouter } from "next/router";
import ReactMarkdown from "react-markdown";
import { api, RouterOutputs } from "~/utils/api";
import { profileRouter } from "../../server/api/routers/profile";
import Link from "next/link";
import { udpatedRecentlyViewedJson } from "../../server/helpers/dataHelper";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

const useUserProfile = (userId: string) => {
  const { data } = api.profile.getById.useQuery({
    id: String(userId),
  });
  return data;
};

const SinglePagePost = () => {
  const router = useRouter();
  const { id } = router.query;
  let num_id = Number(id);
  const { user } = useUser()!;
  const { data } = api.posts.getById.useQuery({
    id: num_id,
  });
  const user_profile = useUserProfile(user.id);

  const { mutate } = api.profile.updateRecentlyViewed.useMutation({
    onSuccess: () => {
      console.log("post has been added");
    },
    onError: (error) => {
      const errorMessage = error.data?.zodError?.fieldErrors.content;
      alert("Something went wrong, failed to Post");
    },
  });

  useEffect(() => {
    const updateData = async () => {
      try {
        console.log("trying to update json...");
        const recent_posts_json = user_profile.recent_posts_json;
        const new_recent_posts_json = udpatedRecentlyViewedJson(
          recent_posts_json,
          "id",
          num_id
        );
        console.log(new_recent_posts_json);
        mutate({ content: String(new_recent_posts_json) });
      } catch (error) {
        console.log(error);
      }
    };
    updateData();
  }, []);

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
