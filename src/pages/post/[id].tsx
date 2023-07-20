import { useRouter } from "next/router";
import ReactMarkdown from "react-markdown";
import { api } from "~/utils/api";
import Link from "next/link";
import { udpatedRecentlyViewedJson } from "../../server/helpers/dataHelper";
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { PageLayout } from "~/components/layouts";
import { LoadingSpinner } from "~/components/loadingspinner";
import { IoIosCopy, IoIosCheckmarkCircleOutline } from "react-icons/io";
import { CopyToClipboard } from "react-copy-to-clipboard";
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

const notify = () => {
  alert("Copied to clipboard");
};

// const CodeBlock = ({ string: code }) => {
//   return (
//     <div className="relative">
//       <button className="absolute right-0 top-0 flex flex-row p-2">
//         <CopyToClipboard text={code} onCopy={() => notify()}>
//           <IoIosCopy className="m-1 basis-1/4 text-lg hover:text-white" />
//         </CopyToClipboard>
//       </button>
//     </div>
//   );
// };

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
                className="prose-code:text-md prose prose-pre:max-w-none prose-pre:bg-codeGrey"
                children={post_data.data.post}
                components={{
                  code({ node, inline, className, children, style, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    return !inline && match ? (
                      <div className="relative">
                        <button className="absolute right-0 top-0 flex flex-row p-2">
                          <span>
                            <CopyToClipboard
                              text={String(children).replace(/\n$/, "")}
                              onCopy={() => notify()}
                            >
                              <IoIosCopy className="m-1 basis-1/4 text-lg hover:text-white" />
                            </CopyToClipboard>
                          </span>
                        </button>

                        <div>
                          <SyntaxHighlighter
                            language={match[1]}
                            style={oneDark}
                            {...props}
                          >
                            {String(children).replace(/\n$/, "")}
                          </SyntaxHighlighter>
                        </div>
                      </div>
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
