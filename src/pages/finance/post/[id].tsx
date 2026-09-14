import { useUser } from "@clerk/nextjs";
import { RedirectToSignIn } from "@clerk/nextjs";
import { useRouter } from "next/router";
import ReactMarkdown from "react-markdown";
import { api } from "~/utils/api";
import { exportToPDF } from "~/utils/exportPDF";
import Link from "next/link";
import { udpatedRecentlyViewedJson } from "../../../server/helpers/dataHelper";
import { useEffect } from "react";
import { PageLayout } from "~/components/layouts";
import { LoadingSpinner } from "~/components/loadingspinner";
import { MarkdownRenderer } from "~/components/markdownRenderer";
import React from "react";

const useUserProfile = (userId: string) => {
  const { data, isError, isLoading, error } = api.profile.getById.useQuery({
    id: String(userId),
  });
  return { data, isError, isLoading, error };
};

const usePostInfo = (post_id: number) => {
  const { data, isError, isLoading, error } = api.financePosts.getById.useQuery({
    id: post_id,
  });
  return { data, isError, isLoading, error };
};

const FinanceSinglePagePost = () => {
  const router = useRouter();
  const { id } = router.query;
  const num_id = Number(id);
  const { user, isSignedIn } = useUser();
  if (!isSignedIn) return <RedirectToSignIn redirectUrl={router.asPath} />;

  const post_data = usePostInfo(num_id);
  const user_profile = useUserProfile(user.id);

  const { mutate } = api.profile.updateFinanceRecentlyViewed.useMutation({
    onSuccess: () => console.log("finance post added to recently viewed"),
    onError: () => alert("Something went wrong, failed to update recently viewed"),
  });

  useEffect(() => {
    const updateData = async () => {
      if (user_profile.data?.finance_recent_posts_json != null && post_data.data?.post) {
        const newPost = `{"id":${num_id},"title":"${post_data.data.title}"}`;
        const recent_posts_json = user_profile.data.finance_recent_posts_json;
        try {
          const new_recent_posts_json = udpatedRecentlyViewedJson(recent_posts_json, newPost);
          mutate({ content: String(new_recent_posts_json) });
        } catch (error) {
          console.log(error);
        }
      }
    };
    updateData();
  }, [post_data.data, num_id]);

  if (post_data.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  const handleExportPDF = async () => {
    if (!post_data.data) return;
    const fileName = post_data.data.title.replace(/[^a-z0-9]/gi, "_").toLowerCase();
    const result = await exportToPDF("post-content", fileName);
    if (result.success) {
      alert("PDF exported successfully");
    } else {
      alert("Failed to export PDF, please try again");
    }
  };

  if (!post_data.data) return <div>{`404 and id: ${id}`}</div>;

  return (
    <>
      <div className="min-h-screen bg-gradient-to-r from-[#c5e7e2] to-[#a1cda8]">
        <PageLayout>
          <div className="rounded-lg bg-white p-4 drop-shadow-lg">
            <div className="flex justify-end">
              <button
                className="mt-5 rounded bg-[#627264] p-4 px-4 py-2 font-bold text-white hover:bg-[#4f5d51]"
                onClick={handleExportPDF}
              >
                Export PDF
              </button>
            </div>

            <div id="post-content">
              <div className="m-2">
                <h1>
                  <ReactMarkdown className="prose">{`# ${post_data.data.title}`}</ReactMarkdown>
                </h1>
              </div>
              <div className="m-2 mt-5">
                <MarkdownRenderer markdown={post_data.data.post} />
              </div>
            </div>

            <Link href="/finance">
              <button className="mt-5 ml-4 rounded bg-[#627264] p-4 px-4 py-2 font-bold text-white hover:bg-[#4f5d51]">
                home
              </button>
            </Link>
          </div>
        </PageLayout>
      </div>
    </>
  );
};

export default FinanceSinglePagePost;
