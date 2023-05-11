import ReactMarkdown from "react-markdown";
import { useState } from "react";

// const MarkdownTextarea = () => {
//   return (
//     <div className="flex flex-col">
//       <textarea
//         className="rounded border border-gray-300 p-2"
//         rows={10}
//         value={markdown}
//         onChange={handleChange}
//         placeholder="Enter your Markdown text here"
//       />
//       <div className="mt-4">
//         <ReactMarkdown>{markdown}</ReactMarkdown>
//       </div>
//     </div>
//   );
// };

export const NewPost = () => {
  const [markdown, setMarkdown] = useState("");

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
    </>
  );
};

export default NewPost;
