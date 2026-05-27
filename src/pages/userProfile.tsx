import { useUser } from "@clerk/nextjs";
import { api } from "../utils/api";
import React from "react";
import Image from "next/image";
import default_profile_pic from "../../public/default_profile_pic.png";
import { PageLayout } from "~/components/layouts";
import LikedPostsSection from "~/components/likedPosts";
import Link from "next/link";
import { LoadingPage } from "~/components/loadingspinner";

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
    <div className="m-2 flex items-center rounded-lg bg-slate-100 p-3 shadow-md sm:m-4 sm:p-4">
      <Image
        src={
          props.profile_image_url
            ? props.profile_image_url
            : default_profile_pic
        }
        alt={"profile_pic"}
        width={80}
        height={80}
        className="h-16 w-16 flex-shrink-0 rounded-full border-2 border-solid border-slate-600 sm:h-24 sm:w-24"
      />
      <p className="ml-3 break-all text-sm sm:ml-4 sm:text-base">
        {`email: ${props.email}`}
      </p>
    </div>
  );
};

export const UserProfile = () => {
  const { user, isLoaded: userLoaded } = useUser()!;

  if (!userLoaded) {
    return <LoadingPage />;
  }

  if (!user)
    return (
      <div>
        <p>401 Please Login</p>
      </div>
    );

  const userPosts = useUserPosts(user.id);
  const { data: currentUser } = api.profile.getCurrentUser.useQuery();
  const isAdmin = currentUser?.is_admin ?? false;
  const { mutate, isLoading: isDeleting } = api.posts.delete.useMutation({
    onSuccess: () => {
      alert("Post deleted!");
    },
    onError: (error) => {
      const errorMessage = error.data?.zodError?.fieldErrors.content;
      if (errorMessage && errorMessage[0]) {
        alert(errorMessage[0]);
      } else {
        alert("Something went wrong, failed to delete");
      }
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-300 to-pink-200">
      <PageLayout>
        {/* Profile header */}
        <UserProfileHeader
          profile_image_url={user.profileImageUrl}
          id={user.id}
          email={String(user.emailAddresses)}
        />

        {/* Liked posts */}
        <LikedPostsSection />

        {/* Admin: manage posts */}
        {isAdmin && (
          <div className="m-2 sm:m-4">
            <div className="rounded-lg bg-slate-100 py-3 shadow-md sm:py-4">
              <h2 className="px-4 pb-2 text-sm font-semibold text-slate-600 sm:text-base">
                Your Posts
              </h2>
              <ul className="px-2">
                {!userPosts.data ? (
                  <li className="p-3 text-sm text-slate-500">No posts yet</li>
                ) : (
                  userPosts.data.map((item: UserPost) => (
                    <li
                      key={item.id}
                      className="mb-2 flex flex-wrap items-center gap-2"
                    >
                      {/* Post title link */}
                      <Link
                        href={`/post/${item.id}`}
                        className="min-w-0 flex-1"
                      >
                        <span className="block truncate rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm hover:bg-slate-300">
                          {item.title}
                        </span>
                      </Link>

                      {/* Delete button */}
                      <button
                        className="flex h-10 items-center rounded-lg bg-purple-500 px-3 text-sm font-bold text-white hover:bg-purple-700 disabled:opacity-60"
                        onClick={() => mutate({ id: item.id })}
                        disabled={isDeleting}
                      >
                        Delete
                      </button>

                      {/* Edit button */}
                      <Link href={`/editPost/${item.id}`}>
                        <button className="flex h-10 items-center rounded-lg bg-purple-500 px-3 text-sm font-bold text-white hover:bg-purple-700">
                          Edit
                        </button>
                      </Link>
                    </li>
                  ))
                )}
              </ul>
            </div>

            <Link href="/newPost">
              <button className="mt-3 flex h-11 items-center rounded bg-purple-500 px-5 font-bold text-white hover:bg-purple-700">
                Create New Post
              </button>
            </Link>
          </div>
        )}

        {/* Home link */}
        <div className="m-2 sm:m-4">
          <Link href="/">
            <button className="flex h-11 items-center rounded bg-purple-500 px-5 font-bold text-white hover:bg-purple-700">
              Home
            </button>
          </Link>
        </div>
      </PageLayout>
    </div>
  );
};

export default UserProfile;
