import { useRouter } from "next/router";
import ReactMarkdown from "react-markdown";
import { api } from "~/utils/api";
import Link from "next/link";
import { udpatedRecentlyViewedJson } from "../../server/helpers/dataHelper";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { PageLayout } from "~/components/layouts";
import { LoadingSpinner } from "~/components/loadingspinner";
import React from "react";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  coy,
  oneDark,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";

// import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// import { okaidia } from "react-syntax-highlighter/dist/esm/styles/prism";
// import remarkGfm from "remark-gfm";
// import language from "react-syntax-highlighter/dist/esm/languages/hljs/1c";
// import { ReactNode } from "react";

// interface CodeBlockProps {
//   inline: boolean;
//   className: string;
//   children: ReactNode;
// }

// const CodeBlock: React.FC<CodeBlockProps> = ({
//   inline,
//   className,
//   children,
// }) => {
//   const match = /language-(\w+)/.exec(className || "");
//   return !inline && match ? (
//     <SyntaxHighlighter
//       style={okaidia}
//       language={match[1]}
//       PreTag="div"
//       children={String(children)}
//       customStyle={{
//         border: "none",
//         borderRadius: "10px",
//         padding: "15px",
//         margin: "10px",
//         width: "100%",
//       }}
//     />
//   ) : (
//     <code className={className}>{children}</code>
//   );
// };

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
      <div className="h-screen bg-gradient-to-r from-purple-300 to-pink-200">
        <PageLayout>
          <div className="rounded-lg bg-white p-4 drop-shadow-lg">
            <div className="m-2">
              <h1>
                <ReactMarkdown className="prose">{`#  ${post_data.data.title}`}</ReactMarkdown>
              </h1>
            </div>
            <div className="m-2 mt-5">
              <ReactMarkdown
                children={post_data.data.post}
                components={{
                  code({ node, inline, className, children, ...props }) {
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
                <button className="mt-5 rounded bg-purple-500 p-4 px-4 py-2 font-bold text-white hover:bg-purple-700">
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
