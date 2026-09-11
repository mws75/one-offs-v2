import { api } from "../utils/api";
import Link from "next/link";
import Image from "next/image";
import default_profile_pic from "../../public/default_profile_pic.png";
import { useUser } from "@clerk/nextjs";
import { LoadingPage } from "./loadingspinner";
import logo from "../../public/ByteSizeTechLogo.png";

interface recentPosts {
  id: number;
  title: string;
}

const useUserProfile = (userId: string) => {
  const { data, isError, isLoading, error } = api.profile.getById.useQuery({
    id: String(userId),
  });
  return { data, isError, isLoading, error };
};

export const FinanceRecentlyViewedObject = () => {
  const { user } = useUser();

  if (!user) return <div><p>401 Please Login</p></div>;

  const profile_image_url = user?.profileImageUrl;
  const user_profile = useUserProfile(user.id);

  if (user_profile.isLoading) return <LoadingPage />;

  const recentPostsJson: recentPosts[] = user_profile.data?.finance_recent_posts_json
    ? JSON.parse(String(user_profile.data.finance_recent_posts_json))
    : [];

  return (
    <>
      <div className="h-min-35 m-4 grid w-11/12 grid-cols-6 items-center rounded-lg bg-slate-100 shadow-md">
        <div className="col-span-1 m-2 justify-items-center">
          <Link href="/userProfile">
            <span>
              <Image
                src={profile_image_url ? profile_image_url : default_profile_pic}
                alt="profile_pic"
                width={120}
                height={120}
                className="m-2 h-14 w-14 justify-items-center rounded-full border-2 border-solid border-slate-600 sm:h-auto sm:w-auto"
              />
            </span>
          </Link>
        </div>
        <div className="col-span-4">
          <ul>
            {recentPostsJson.map((item: recentPosts) => (
              <Link href={`/finance/post/${item.id}`} key={item.id}>
                <li className="border-slate m-2 ml-4 rounded-lg border-2 border-solid bg-slate-100 p-2 hover:bg-[#e8f5ef]">
                  <span className="relative">{item.title}</span>
                </li>
              </Link>
            ))}
          </ul>
        </div>
        <div className="col-span-1 m-2">
          <Link href="/finance">
            <span>
              <Image src={logo} alt="logo" layout="responsive" height={120} width={120} />
            </span>
          </Link>
        </div>
        <div className="col-span-1 m-4"></div>
      </div>
    </>
  );
};
