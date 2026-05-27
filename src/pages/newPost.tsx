import ReactMarkdown from "react-markdown";
import { useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { api } from "../utils/api";
import { type NextPage } from "next";
import { PageLayout } from "~/components/layouts";

export const NewPost = () => {
  const [markdown, setMarkdown] = useState("");
  const [post_title, setPost_title] = useState("");
  const [input, setInput] = useState("");
  const { user } = useUser()!;

  if (!user)
    return (
      <div>
        <p>401 Please Login</p>
      </div>
    );

  const ctx = api.useContext();

  const handleChange = (e: any) => {
    setMarkdown(e.target.value);
  };

  const handleTitleChange = (e: any) => {
    setPost_title(e.target.value);
  };

  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: () => {
      setMarkdown("");
      setPost_title("");
      void ctx.posts.getAll.invalidate();
    },
    onError: (error) => {
      const errorMessage = error.data?.zodError?.fieldErrors.content;
      if (errorMessage && errorMessage[0]) {
        alert(errorMessage[0]);
      } else {
        alert(
          "Something went wrong, failed to Post, Post must be < 5000 characters." +
            String(error)
        );
      }
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-300 to-pink-200">
      <PageLayout>
        <div className="p-4 sm:p-6">
          <h1 className="mb-4 text-xl font-bold sm:text-2xl">New Post</h1>

          <label className="mb-1 block text-sm font-medium text-gray-900">
            Title
          </label>
          <input
            id="title"
            className="mb-4 block w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Post title..."
            value={post_title}
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
                if (
                  user.primaryEmailAddress?.emailAddress ===
                  "mwspencer75@gmail.com"
                ) {
                  mutate({
                    title: post_title,
                    content: markdown,
                    profile_image_url: user?.profileImageUrl || "none",
                  });
                } else {
                  alert("You are not authorized to submit posts.");
                }
              }}
              className="flex h-11 items-center rounded bg-blue-500 px-5 font-bold text-white hover:bg-blue-700 disabled:opacity-60"
              disabled={isPosting}
            >
              {isPosting ? "Submitting…" : "Submit"}
            </button>
            <Link href="/">
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

export default NewPost;
