import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import PostObject from "~/components/postobject";
import { useUser } from "@clerk/nextjs";
import { LoadingPage } from "./loadingspinner";
import { serialize } from "v8";
import {
  convertJSONtoArray,
  combineJSONObjects,
} from "../server/helpers/dataHelper";
import { init } from "next/dist/compiled/@vercel/og/satori";

// Do something like this: https://react.dev/learn/updating-arrays-in-state

// hook to get user's liked posts
const useLikedPosts = () => {
  const { data, isError, isLoading, error } =
    api.likedPosts.getAllIDs.useQuery();
  return { data, isError, isLoading, error };
};

const PostFeed = () => {
  const { user } = useUser();
  if (!user) return null;

  const userId = user.id;
  const profile_image_url = user.profileImageUrl;

  const { data: initialData, isLoading: postsLoading } =
    api.posts.getAll.useQuery();

  const { data: initialLikedPosts, isLoading: likedPostsLoading } =
    api.likedPosts.getAllIDs.useQuery();

  const [searchTrigger, setSearchTrigger] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const encodedSearch = encodeURIComponent(searchQuery);
  const { data: filteredData, isLoading: filteredPostsLoading } =
    api.posts.getByTitle.useQuery({
      queryString: encodedSearch,
    });

  const [data, setData] = useState(initialData);
  const user_profile = api.profile.getById.useQuery({ id: userId });
  const { mutate } = api.profile.insertNewUser.useMutation({});
  const [dataFeteched, setDataFetched] = useState(false);
  const [likedPosts, setLikedPosts] = useState<number[]>([]);

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  useEffect(() => {
    if (likedPostsLoading) {
      return;
    }
    if (initialLikedPosts === undefined) {
      return;
    }
    const initialLikedPostsString = JSON.stringify(initialLikedPosts);
    const likedPostsArray = convertJSONtoArray(
      initialLikedPostsString,
      "post_id",
    );
    setLikedPosts(likedPostsArray);
  }, [initialLikedPosts]);

  useEffect(() => {
    if (filteredPostsLoading) {
      return;
    }
    setData(filteredData);
  }, [searchTrigger]);

  // Checking that User Exists
  // or Creating new User
  useEffect(() => {
    // only proceed if the user profile query has finished
    if (user_profile.isLoading) {
      return;
    }

    // if the user doesn't exist in db and we haven't tried creating yet
    if (user_profile.data === null && !dataFeteched) {
      console.log("user not found in db, creating new user...");
      mutate(
        { profile_image_url },
        {
          onSuccess: () => {
            console.log("Successfully creating new user profile");
            setDataFetched(true);
          },
          onError: (error) => {
            console.log("Failed to create user profile:", error);
            setDataFetched(true);
          },
        },
      );
    } else if (user_profile.data) {
      // User exists in DB:
      setDataFetched(true);
    }
  }, [user_profile.isLoading, user_profile.data, dataFeteched]);

  const onSearch = (event: React.FormEvent) => {
    event.preventDefault();
    setSearchTrigger(!searchTrigger);
    setData(data);
  };

  if (postsLoading) {
    return <LoadingPage />;
  }

  if (!data) {
    return <p className="m-4">no data found </p>;
  }

  return (
    <>
      {/* Search bar – full width with horizontal padding */}
      <div className="mb-3 flex w-full items-center px-2 sm:px-4">
        <form className="flex w-full items-center shadow-md" onSubmit={onSearch}>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            type="text"
            placeholder="Search"
            className="min-h-[44px] w-full rounded-l-md bg-slate-100 px-4 py-2 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            type="button"
            className="min-h-[44px] rounded-r-md bg-purple-500 px-4 py-2 text-white transition-colors hover:bg-purple-600"
            onClick={onSearch}
          >
            Search
          </button>
        </form>
      </div>

      {/* Post grid: 2 cols on mobile, 3 on medium+ */}
      <div className="grid grid-cols-2 gap-2 px-2 sm:px-4 md:grid-cols-3">
        {data.map((post) => {
          const liked = likedPosts.includes(post.id) ? 1 : 0;
          const likedJSON = `{"liked":${liked}}`;

          let postString = JSON.stringify(post);
          const postObject = combineJSONObjects(postString, likedJSON);
          const postJSON = JSON.parse(postObject);

          return (
            <div key={post.id}>
              <PostObject {...postJSON} key={post.id} />
            </div>
          );
        })}
      </div>
    </>
  );
};

export default PostFeed;
