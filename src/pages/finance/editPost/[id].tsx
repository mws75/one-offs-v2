import ReactMarkdown from "react-markdown";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { api } from "~/utils/api";
import { PageLayout } from "~/components/layouts";
import { useRouter } from "next/router";
import { LoadingPage } from "~/components/loadingspinner";

const usePostInfo = (post_id: number) => {
  const { data, isError, isLoading, error } = api.financePosts.getById.useQuery({
    id: post_id,
  });
  return { data, isError, isLoading, error };
};

export const EditFinancePost = () => {
  const [markdown, setMarkdown] = useState("");
  const [postTitle, setPostTitle] = useState("");
  const router = useRouter();
  const { id } = router.query;
  const num_id = Number(id);
  const { user, isLoaded: userLoaded } = useUser();

  if (!userLoaded) return <LoadingPage />;
  if (!user) return <div><p>401 Please Login</p></div>;

  const { data: postData, isLoading: postIsLoading } = usePostInfo(num_id);

  useEffect(() => {
    if (!postIsLoading && postData) {
      setPostTitle(postData.title);
      setMarkdown(postData.post);
    }
  }, [postIsLoading]);

  const { mutate, isLoading: isPosting } = api.financePosts.update.useMutation({
    onSuccess: () => {
      router.push(`/finance/post/${id}`);
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

  if (postIsLoading) return <div><p>Loading...</p></div>;
  if (!postData) return (
    <div>
      <p>404 Not Found</p>
      <Link href="/finance">
        <button className="m-5 rounded bg-[#627264] p-4 px-4 py-2 font-bold text-white hover:bg-[#4f5d51]">
          Cancel
        </button>
      </Link>
    </div>
  );

  return (
    <>
      <PageLayout>
        <h1 className="m-4">Edit Finance Post</h1>
        <label className="m-4 mb-2 block text-sm font-medium text-gray-900 dark:text-white">
          Your message
        </label>
        <input
          id="title"
          className="m-5 block w-9/12 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-[#627264] focus:ring-[#627264]"
          placeholder="title..."
          value={postTitle}
          onChange={(e) => setPostTitle(e.target.value)}
        />
        <textarea
          id="message"
          className="m-5 block min-h-[50%] w-9/12 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-[#627264] focus:ring-[#627264]"
          placeholder="Write your thoughts here..."
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
        />
        <div className="m-5">
          <ReactMarkdown className="prose">{markdown}</ReactMarkdown>
        </div>
        <div className="flex">
          <button
            onClick={() => mutate({ title: postTitle, content: markdown, id: num_id })}
            className="my-5 ml-5 rounded bg-[#627264] p-4 px-4 py-2 font-bold text-white hover:bg-[#4f5d51]"
          >
            Save
          </button>
          <Link href="/userProfile">
            <button className="m-5 rounded bg-[#627264] p-4 px-4 py-2 font-bold text-white hover:bg-[#4f5d51]">
              Cancel
            </button>
          </Link>
        </div>
      </PageLayout>
    </>
  );
};

export default EditFinancePost;
