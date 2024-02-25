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
    <>
      <PageLayout>
        <h1 className="m-4">New Post</h1>

        <label className="m-4 mb-2 block text-sm font-medium text-gray-900 dark:text-white">
          Your message
        </label>

        <input
          id="title"
          className="m-5 block w-9/12 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          placeholder="title..."
          value={post_title}
          onChange={handleTitleChange}
        ></input>
        <textarea
          id="message"
          className="!important m-5  block min-h-[50%] w-9/12 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          placeholder="Write your thoughts here..."
          value={markdown}
          onChange={handleChange}
        ></textarea>

        <div className="m-5">
          <ReactMarkdown className="prose">{markdown}</ReactMarkdown>
        </div>
        <div className="flex">
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
                alert("You are not authorized to submit posts."); // You can replace this with a more subtle notification if preferred
              }
            }}
            className="my-5 ml-5 rounded bg-blue-500 p-4 px-4 py-2 font-bold text-white hover:bg-blue-700"
          >
            Submit
          </button>
          <Link href="/">
            <button className="m-5 rounded bg-blue-500 p-4 px-4 py-2 font-bold text-white hover:bg-blue-700">
              Cancel
            </button>
          </Link>
        </div>
      </PageLayout>
    </>
  );
};

export default NewPost;
