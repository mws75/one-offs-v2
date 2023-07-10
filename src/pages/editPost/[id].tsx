import ReactMarkdown from "react-markdown";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { api } from "../../utils/api";
import { type NextPage } from "next";
import { PageLayout } from "~/components/layouts";
import { useRouter } from "next/router";
import { IdentificationLink } from "@clerk/nextjs/dist/api";

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
  const { user } = useUser();
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
      <div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!postData) {
    return (
      <div>
        <p>404 Not Found</p>
        <Link href="/">
          <button className="m-5 rounded bg-blue-500 p-4 px-4 py-2 font-bold text-white hover:bg-blue-700">
            Cancel
          </button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <PageLayout>
        <h1 className="m-4">Edit Post</h1>

        <label className="m-4 mb-2 block text-sm font-medium text-gray-900 dark:text-white">
          Your message
        </label>

        <input
          id="title"
          className="m-5 block w-9/12 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          placeholder="title..."
          value={postTitle}
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
              mutate({
                title: postTitle,
                content: markdown,
                id: num_id,
              });
            }}
            className="my-5 ml-5 rounded bg-blue-500 p-4 px-4 py-2 font-bold text-white hover:bg-blue-700"
          >
            Save
          </button>
          <Link href="/userProfile">
            <button className="m-5 rounded bg-blue-500 p-4 px-4 py-2 font-bold text-white hover:bg-blue-700">
              Cancel
            </button>
          </Link>
        </div>
      </PageLayout>
    </>
  );
};

export default EditPost;
