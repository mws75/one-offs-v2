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
    // Get Post Contents
    if (!post_data.data) {
      console.log("no data to export");
      return;
    }
    // Get Utility
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
      <div className="h-screen bg-gradient-to-r from-purple-300 to-pink-200">
        <PageLayout>
          <div className="rounded-lg bg-white p-4 drop-shadow-lg">
            <div className="flex justify-end">
              <button
                className="mt-5 rounded bg-purple-500 p-4 px-4 py-2 font-bold text-white hover:bg-purple-700"
                onClick={handleExportPDF}
              >
                Export PDF
              </button>
            </div>

            {/* Content to export to PDF */}
            <div id="post-content">
              <div className="m-2">
                <h1>
                  <ReactMarkdown className="prose">{`#  ${post_data.data.title}`}</ReactMarkdown>
                </h1>
              </div>
              <div className="m-2 mt-5">
                <ReactMarkdown
                  className="prose-md prose 
                           w-full max-w-none
                           prose-p:w-11/12 
                           prose-code:text-base
                           prose-pre:w-full 
                           prose-pre:bg-codeGrey 
                           prose-li:w-11/12"
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
              </div>
            </div>

            <Link href="/">
              <button className="mt-5 ml-4 rounded bg-purple-500 p-4 px-4 py-2 font-bold text-white hover:bg-purple-700">
                home
              </button>
            </Link>
          </div>
        </PageLayout>
      </div>
    </>
  );
};

export default SinglePagePost;
