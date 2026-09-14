import { useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { api } from "~/utils/api";
import { type NextPage } from "next";
import { PageLayout } from "~/components/layouts";
import { MarkdownRenderer } from "~/components/markdownRenderer";

export const NewFinancePost = () => {
  const [markdown, setMarkdown] = useState("");
  const [post_title, setPost_title] = useState("");
  const { user } = useUser()!;

  if (!user) return <div><p>401 Please Login</p></div>;

  const ctx = api.useContext();

  const { mutate, isLoading: isPosting } = api.financePosts.create.useMutation({
    onSuccess: () => {
      setMarkdown("");
      setPost_title("");
      void ctx.financePosts.getAll.invalidate();
    },
    onError: (error) => {
      const errorMessage = error.data?.zodError?.fieldErrors.content;
      if (errorMessage && errorMessage[0]) {
        alert(errorMessage[0]);
      } else {
        alert(
          "Something went wrong, failed to Post. Post must be < 10000 characters. " +
            String(error)
        );
      }
    },
  });

  return (
    <>
      <PageLayout>
        <h1 className="m-4">New Finance Post</h1>
        <label className="m-4 mb-2 block text-sm font-medium text-gray-900 dark:text-white">
          Your message
        </label>
        <input
          id="title"
          className="m-5 block w-9/12 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-[#627264] focus:ring-[#627264]"
          placeholder="title..."
          value={post_title}
          onChange={(e) => setPost_title(e.target.value)}
        />
        <textarea
          id="message"
          className="m-5 block min-h-[50%] w-9/12 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-[#627264] focus:ring-[#627264]"
          placeholder="Write your finance thoughts here..."
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
        />
        <div className="m-5">
          <MarkdownRenderer markdown={markdown} />
        </div>
        <div className="flex">
          <button
            onClick={() => {
              if (
                user.primaryEmailAddress?.emailAddress === "mwspencer75@gmail.com"
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
            className="my-5 ml-5 rounded bg-[#627264] p-4 px-4 py-2 font-bold text-white hover:bg-[#4f5d51]"
          >
            Submit
          </button>
          <Link href="/finance">
            <button className="m-5 rounded bg-[#627264] p-4 px-4 py-2 font-bold text-white hover:bg-[#4f5d51]">
              Cancel
            </button>
          </Link>
        </div>
      </PageLayout>
    </>
  );
};

export default NewFinancePost;
