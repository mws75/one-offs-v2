import { PageLayout } from "~/components/layouts";
import ReactMarkdown from "react-markdown";
import Link from "next/link";

const AboutPage = () => {
  const post = `# The Purpose of Byte Size Tech \n What do tech bloggers and food
    bloggers have in common? They both believe they need to write the next
    great Epic before presenting the information you actually came for.
    Byte Size Tech is short and sweet blog posts that give you exactly
    what you need and nothing more. No more reading about the history web
    development when you are trying to learn how to use a React Hook. No
    more scrolling down the page filled with of machine learning theories when you want to
    remember how to loop through a Pandas Data Frame. We believe you came
    here for one reason. To find a quick solution so that you can get back
    to building.`;
  return (
    <div className="h-screen bg-gradient-to-r from-purple-300 to-pink-200">
      <PageLayout>
        <div>
          <ReactMarkdown className="prose m-10">{post}</ReactMarkdown>
        </div>
        <Link href="/" className="ml-10">
          <button className="mt-5 rounded bg-purple-500 p-4 px-4 py-2 font-bold text-white hover:bg-purple-700">
            home
          </button>
        </Link>
      </PageLayout>
    </div>
  );
};

export default AboutPage;
