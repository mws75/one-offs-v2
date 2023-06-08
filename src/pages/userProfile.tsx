import { useUser } from "@clerk/nextjs";
import { api } from "../utils/api";
import React from "react";
import Image from "next/image";
import default_profile_pic from "../../public/default_profile_pic.png";
import { PageLayout } from "~/components/layouts";
import Link from "next/link";

interface UserProps {
  id: string;
  profile_image_url: string;
  email: string;
}

interface UserPost {
  id: number;
  title: string;
}

// Custom Hooks
const useUserPosts = (user_name: string) => {
  const { data, isError, isLoading, error } = api.posts.getUserPosts.useQuery({
    user_name: user_name,
  });
  return { data, isError, isLoading, error };
};

const UserProfileHeader: React.FC<UserProps> = (props) => {
  return (
    <>
      <div className="m-4 flex h-40 w-11/12  items-center rounded-lg bg-slate-100 shadow-md">
        <Image
          src={
            props.profile_image_url
              ? props.profile_image_url
              : default_profile_pic
          }
          alt={"profile_pic"}
          width={120}
          height={120}
          className="m-4 rounded-full border-2 border-solid border-slate-600"
        />
        <p>{`email: ${props.email}`}</p>
      </div>
    </>
  );
};

export const UserProfile = () => {
  const { user } = useUser()!;

  if (!user)
    return (
      <div>
        <p>401 Please Login</p>
      </div>
    );

  const userPosts = useUserPosts(user.id);

  console.log(userPosts.data);

  return (
    <>
      <div className="bg-gradient-to-r from-purple-300 to-pink-200">
        <PageLayout>
          <UserProfileHeader
            profile_image_url={user.profileImageUrl}
            id={user.id}
            email={String(user.emailAddresses)}
          />
          <div className="m-4 flex w-11/12  items-center rounded-lg bg-slate-100 shadow-md">
            <ul>
              {!userPosts.data ? (
                <li>no posts yet</li>
              ) : (
                userPosts.data.map((item: UserPost) => (
                  <Link href={`/post/${item.id}`}>
                    <li
                      key={item.id}
                      className="border-slate m-2 ml-4 flex w-96 rounded-lg border-2 border-solid bg-slate-100 p-2 hover:bg-slate-300"
                    >
                      <span className="flex-grow self-center">
                        {item.title}
                      </span>
                      <button className="justify-items-end rounded bg-purple-500 p-4 px-4 py-2 font-bold text-white hover:bg-purple-700">
                        delete
                      </button>
                    </li>
                  </Link>
                ))
              )}
            </ul>
          </div>
          <Link href="/">
            <button className="m-4 mt-5 rounded bg-purple-500 p-4 px-4 py-2 font-bold text-white hover:bg-purple-700">
              home
            </button>
          </Link>
        </PageLayout>
      </div>
    </>
  );
};

export default UserProfile;
