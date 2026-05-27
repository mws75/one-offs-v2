import ReactMarkdown from "react-markdown";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { api } from "../../utils/api";
import { type NextPage } from "next";
import { PageLayout } from "~/components/layouts";
import { useRouter } from "next/router";
import { LoadingPage } from "~/components/loadingspinner";

const usePostInfo = (post_id: number) => {
  const { data, isError, isLoading, error } = api.posts.getById.useQuery({
    id: post_id,
  });

  return { data, isError, isLoading, error };
};

export const EditPost = () => {
  const [markdown, setMarkdown] = useState("");
  const [postTitle, setPostTitle] = useState("");
  const router = useRouter();
  const { id } = router.query;
  let num_id = Number(id);
  const { user, isLoaded: userLoaded } = useUser();

  if (!userLoaded) {
    return <LoadingPage />;
  }

  if (!user) {
    return (
      <div>
        <p>401 Please Login</p>
      </div>
    );
  }
  const { data: postData, isLoading: postIsLoading } = usePostInfo(num_id);

  useEffect(() => {
    if (!postIsLoading && postData) {
      setPostTitle(postData.title);
      setMarkdown(postData.post);
    }
  }, [postIsLoading]);

  const handleChange = (e: any) => {
    setMarkdown(e.target.value);
  };

  const handleTitleChange = (e: any) => {
    setPostTitle(e.target.value);
  };

  const { mutate, isLoading: isPosting } = api.posts.update.useMutation({
    onSuccess: () => {
      router.push(`/post/${id}`);
      alert("Post updated successfully");
    },
    onError: (error) => {
      const errorMessage = error.data?.zodError?.fieldErrors.content;
      if (errorMessage && errorMessage[0]) {
        alert(errorMessage[0]);
      } else {
        alert("Something went wrong, failed to update post: " + String(error));
      }
    },
  });

  if (postIsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingPage />
      </div>
    );
  }

  if (!postData) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6">
        <p className="text-lg">404 – Post not found</p>
        <Link href="/">
          <button className="flex h-11 items-center rounded bg-blue-500 px-5 font-bold text-white hover:bg-blue-700">
            Go Home
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-300 to-pink-200">
      <PageLayout>
        <div className="p-4 sm:p-6">
          <h1 className="mb-4 text-xl font-bold sm:text-2xl">Edit Post</h1>

          <label className="mb-1 block text-sm font-medium text-gray-900">
            Title
          </label>
          <input
            id="title"
            className="mb-4 block w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Post title..."
            value={postTitle}
            onChange={handleTitleChange}
          />

          <label className="mb-1 block text-sm font-medium text-gray-900">
            Content (Markdown)
          </label>
          <textarea
            id="message"
            className="mb-4 block min-h-[40vh] w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Write your thoughts here..."
            value={markdown}
            onChange={handleChange}
          />

          {/* Live markdown preview */}
          {markdown.length > 0 && (
            <div className="mb-4 rounded-lg border border-slate-200 bg-white p-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Preview
              </p>
              <ReactMarkdown className="prose prose-sm max-w-none sm:prose-base">
                {markdown}
              </ReactMarkdown>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => {
                mutate({
                  title: postTitle,
                  content: markdown,
                  id: num_id,
                });
              }}
              className="flex h-11 items-center rounded bg-blue-500 px-5 font-bold text-white hover:bg-blue-700 disabled:opacity-60"
              disabled={isPosting}
            >
              {isPosting ? "Saving…" : "Save"}
            </button>
            <Link href="/userProfile">
              <button className="flex h-11 items-center rounded bg-blue-500 px-5 font-bold text-white hover:bg-blue-700">
                Cancel
              </button>
            </Link>
          </div>
        </div>
      </PageLayout>
    </div>
  );
};

export default EditPost;
