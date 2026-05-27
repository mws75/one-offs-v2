import { useUser } from "@clerk/nextjs";
import { RedirectToSignIn } from "@clerk/nextjs";
import { useRouter } from "next/router";
import ReactMarkdown from "react-markdown";
import { api } from "~/utils/api";
import { exportToPDF } from "~/utils/exportPDF";
import Link from "next/link";
import { udpatedRecentlyViewedJson } from "../../server/helpers/dataHelper";
import { useEffect } from "react";
import { PageLayout } from "~/components/layouts";
import { LoadingSpinner } from "~/components/loadingspinner";
import { IoIosCopy } from "react-icons/io";

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

const SinglePagePost = () => {
  const router = useRouter();
  const { id } = router.query;
  let num_id = Number(id);
  const { user, isSignedIn } = useUser();
  if (!isSignedIn) return <RedirectToSignIn redirectUrl={router.asPath} />;

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
            newPost,
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

  // ------------------------------
  // Buttons
  // -----------------------------
  const handleExportPDF = async () => {
    console.log("going to export Markdown as PDF");
    if (!post_data.data) {
      console.log("no data to export");
      return;
    }
    const fileName = post_data.data.title
      .replace(/[^a-z0-9]/gi, "_")
      .toLowerCase();
    const result = await exportToPDF("post-content", fileName);
    if (result.success) {
      alert("PDF exported successfully");
    } else {
      alert("Failed to export PDF, please try again");
    }
  };

  if (!post_data.data) return <div>{`404 and id: ${id}`}</div>;

  return (
    <>
      <div className="min-h-screen bg-gradient-to-r from-purple-300 to-pink-200">
        <PageLayout>
          <div className="rounded-lg bg-white p-3 shadow-lg sm:p-6">

            {/* Top action row */}
            <div className="flex justify-end">
              <button
                className="mt-3 flex h-11 items-center rounded bg-purple-500 px-4 font-bold text-white hover:bg-purple-700 sm:mt-5"
                onClick={handleExportPDF}
              >
                Export PDF
              </button>
            </div>

            {/* Post content */}
            <div id="post-content">
              <div className="m-2">
                <ReactMarkdown className="prose prose-sm sm:prose-base">
                  {`# ${post_data.data.title}`}
                </ReactMarkdown>
              </div>

              <div className="m-2 mt-4">
                <ReactMarkdown
                  className="prose prose-sm w-full max-w-none
                             sm:prose-base
                             prose-pre:overflow-x-auto
                             prose-pre:bg-codeGrey
                             prose-pre:text-sm
                             prose-code:text-sm"
                  children={post_data.data.post}
                  components={{
                    code({
                      node,
                      inline,
                      className,
                      children,
                      style,
                      ...props
                    }) {
                      const match = /language-(\w+)/.exec(className || "");
                      return !inline && match ? (
                        <div className="relative">
                          <button className="absolute right-2 top-2 z-10 flex items-center rounded p-1 hover:opacity-75">
                            <CopyToClipboard
                              text={String(children).replace(/\n$/, "")}
                              onCopy={() => notify()}
                            >
                              <IoIosCopy className="text-lg text-slate-300 hover:text-white" />
                            </CopyToClipboard>
                          </button>

                          <SyntaxHighlighter
                            language={match[1]}
                            style={oneDark}
                            {...props}
                          >
                            {String(children).replace(/\n$/, "")}
                          </SyntaxHighlighter>
                        </div>
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    },
                  }}
                />
              </div>
            </div>

            {/* Footer nav */}
            <Link href="/">
              <button className="mt-4 flex h-11 items-center rounded bg-purple-500 px-4 font-bold text-white hover:bg-purple-700">
                Home
              </button>
            </Link>
          </div>
        </PageLayout>
      </div>
    </>
  );
};

export default SinglePagePost;
