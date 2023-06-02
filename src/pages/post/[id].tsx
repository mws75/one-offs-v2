import { NextPage } from "next";
import { useRouter } from "next/router";
import ReactMarkdown from "react-markdown";
import { api, RouterOutputs } from "~/utils/api";
import { profileRouter } from "../../server/api/routers/profile";
import Link from "next/link";
import { udpatedRecentlyViewedJson } from "../../server/helpers/dataHelper";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { PageLayout } from "~/components/layouts";

const useUserProfile = (userId: string) => {
  const { data, isError, isLoading, error } = api.profile.getById.useQuery({
    id: String(userId),
  });
  return { data, isError, isLoading, error };
};

const usePostInfo = (post_id: number) => {
  const { data, isError, isLoading, error } = api.posts.getById.useQuery({
    id: post_id,
  });
  return { data, isError, isLoading, error };
};

const SinglePagePost = () => {
  const router = useRouter();
  const { id } = router.query;
  let num_id = Number(id);
  const { user } = useUser();
  if (!user) return null;

  const post_data = usePostInfo(num_id);
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
    console.log("using useEffect...");
    const updateData = async () => {
      if (user_profile.data?.recent_posts_json && post_data.data?.post) {
        console.log("passing the if statement...");
        const newPost = `{"id":${num_id},"title":"${post_data.data.title}"}`;
        const recent_posts_json = user_profile.data?.recent_posts_json;
        console.log(newPost);
        try {
          const new_recent_posts_json = udpatedRecentlyViewedJson(
            recent_posts_json,
            newPost
          );
          console.log(new_recent_posts_json);
          mutate({ content: String(new_recent_posts_json) });
        } catch (error) {
          console.log(error);
        }
      }
    };
    updateData();
  }, [post_data.data, num_id]);

  if (!post_data.data) return <div>{`404 and id: ${id}`}</div>;
  return (
    <>
      <div className="bg-gradient-to-r from-purple-300 to-pink-200">
        <PageLayout>
          <div className="ml-5 mr-5 h-screen rounded-lg bg-white p-4 drop-shadow-lg">
            <div className="m-5">
              <h1>
                <ReactMarkdown className="prose">{`#  ${post_data.data.title}`}</ReactMarkdown>
              </h1>
            </div>
            <div className="m-5">
              <ReactMarkdown className="prose">
                {post_data.data.post}
              </ReactMarkdown>
              <Link href="/">
                <button className="mt-5 rounded bg-blue-500 p-4 px-4 py-2 font-bold text-white hover:bg-blue-700">
                  home
                </button>
              </Link>
            </div>
          </div>
        </PageLayout>
      </div>
    </>
  );
};

export default SinglePagePost;
