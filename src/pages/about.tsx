import { PageLayout } from "~/components/layouts";
import ReactMarkdown from "react-markdown";
import Link from "next/link";

const AboutPage = () => {
  const post = `# The Purpose of Byte Size Tech \n What do tech bloggers and food
    bloggers have in common? They both believe they need to write the next
    great Epic before presenting the information you actually came for.
    Byte Size Tech is short and sweet blog posts that give you exactly
    what you need and nothing more. No more reading about the history of web
    development when you are trying to learn how to use a React Hook. No
    more scrolling down a page filled with machine learning theories when you want to
    remember how to loop through a Pandas Data Frame. We believe you came
    here for one reason. To find a quick solution so that you can get back
    to building. Our mission is to waste our time
    writing so you don't have to waste yours reading. \n
Our expansive team of some of the worlds leading software engineers work tirelessly to give
you the best technology related blog posts humanly possible.`;

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-300 to-pink-200">
      <PageLayout>
<<<<<<< HEAD
        <div className="p-4 sm:p-8 sm:pt-10">
          <ReactMarkdown className="prose prose-sm max-w-none sm:prose-base">
            {post}
          </ReactMarkdown>
        </div>
        <div className="px-4 pb-8 sm:px-8">
          <Link href="/">
            <button className="flex h-11 items-center rounded bg-purple-500 px-5 font-bold text-white hover:bg-purple-700">
              Home
            </button>
          </Link>
        </div>
=======
        <div>
          <ReactMarkdown className="prose m-4 sm:m-10">{post}</ReactMarkdown>
        </div>
        <Link href="/" className="ml-4 sm:ml-10">
          <button className="mt-5 rounded bg-purple-500 p-4 px-4 py-2 font-bold text-white hover:bg-purple-700">
            home
          </button>
        </Link>
>>>>>>> old-style-mobile
      </PageLayout>
    </div>
  );
};

export default AboutPage;
