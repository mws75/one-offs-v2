import ReactMarkdown from "react-markdown";
import { useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { api } from "../utils/api";

export const NewPost = () => {
  const [markdown, setMarkdown] = useState("");
  const { user } = useUser()!;
  const ctx = api.useContext;

  const handleChange = (e) => {
    setMarkdown(e.target.value);
  };

  return (
    <>
      <h1>New Post</h1>

      <label className="m-4 mb-2 block text-sm font-medium text-gray-900 dark:text-white">
        Your message
      </label>
      <div className="min-h-550">
        <textarea
          id="message"
          className="!important min-h-450  m-5 block w-9/12 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          placeholder="Write your thoughts here..."
          value={markdown}
          onChange={handleChange}
        ></textarea>
      </div>
      <div className="m-5">
        <ReactMarkdown className="prose">{markdown}</ReactMarkdown>
      </div>
      <div className="flex">
        <button className="m-5 rounded bg-blue-500 p-4 px-4 py-2 font-bold text-white hover:bg-blue-700">
          Submit
        </button>
        <Link href="/">
          <button className="m-5 rounded bg-blue-500 p-4 px-4 py-2 font-bold text-white hover:bg-blue-700">
            Cancel
          </button>
        </Link>
      </div>
    </>
  );
};

export default NewPost;
