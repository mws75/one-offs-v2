import { useRouter } from "next/router";
import ReactMarkdown from "react-markdown";
import { api } from "~/utils/api";
import Link from "next/link";
import { udpatedRecentlyViewedJson } from "../../server/helpers/dataHelper";
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { PageLayout } from "~/components/layouts";
import { LoadingSpinner } from "~/components/loadingspinner";
import React from "react";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

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
  if (!user)
    return (
      <div>
        <p>401 Please Login</p>
      </div>
    );

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
    const updateData = async () => {
      if (user_profile.data?.recent_posts_json && post_data.data?.post) {
        const newPost = `{"id":${num_id},"title":"${post_data.data.title}"}`;
        const recent_posts_json = user_profile.data?.recent_posts_json;
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
  if (post_data.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!post_data.data) return <div>{`404 and id: ${id}`}</div>;
  return (
    <>
      <div className="from-purple-300 to-pink-200 h-screen bg-gradient-to-r">
        <PageLayout>
          <div className="bg-white rounded-lg p-4 drop-shadow-lg">
            <div className="m-2">
              <h1>
                <ReactMarkdown className="prose">{`#  ${post_data.data.title}`}</ReactMarkdown>
              </h1>
            </div>
            <div className="m-2 mt-5">
              <ReactMarkdown
                className="prose-code:text-md prose prose-pre:max-w-none prose-pre:bg-codeGrey"
                children={post_data.data.post}
                components={{
                  code({ node, inline, className, children, style, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    return !inline && match ? (
                      <SyntaxHighlighter
                        children={String(children).replace(/\n$/, "")}
                        language={match[1]}
                        style={oneDark}
                        {...props}
                      />
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  },
                }}
              />

              <Link href="/">
                <button className="bg-purple-500 text-white hover:bg-purple-700 mt-5 rounded p-4 px-4 py-2 font-bold">
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
