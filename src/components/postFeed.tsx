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
    console.log(likedPosts);
    if (likedPostsLoading) {
      return;
    }
    if (initialLikedPosts === undefined) {
      return;
    }
    const initialLikedPostsString = JSON.stringify(initialLikedPosts);
    const likedPostsArray = convertJSONtoArray(initialLikedPostsString, "id");
    console.log(likedPostsArray);
    setLikedPosts(likedPostsArray);
  }, [initialLikedPosts]);

  useEffect(() => {
    if (filteredPostsLoading) {
      return;
    }
    setData(filteredData);
  }, [searchTrigger]);

  useEffect(() => {
    const fetchData = async () => {
      if (user_profile.data === undefined) {
        try {
          await mutate({ profile_image_url });
          setDataFetched(true);
        } catch (error) {
          console.log(error);
          alert("something went wrong");
        }
      } else {
        console.log("user has already been added");
      }
    };
    if (!dataFeteched) {
      fetchData();
    }
  }, []);

  const onSearch = (event: React.FormEvent) => {
    console.log("searching with filter...");
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
      <div className="mb-4 ml-4 flex w-11/12 items-center shadow-md">
        <form className="flex w-full items-center" onSubmit={onSearch}>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            type="text"
            placeholder="Search"
            className="w-11/12 rounded-l-md bg-slate-100 px-4 py-2 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            type="button"
            className="rounded-r-md bg-purple-500 px-4 py-2 text-white transition-colors hover:bg-purple-600"
            onClick={onSearch}
          >
            Search
          </button>
        </form>
      </div>

      <div className="m-2 flex flex-wrap">
        {data.map((post) => {
          const liked = likedPosts.includes(post.id) ? 1 : 0;
          const likedJSON = `{"liked":"+ ${liked} +"}`;

          let postString = JSON.stringify(post);
          console.log("post string: ", postString);
          const postObject = combineJSONObjects(postString, likedJSON);
          const postJSON = JSON.parse(postObject);
          console.log("liked json: ", likedJSON);
          return (
            <div key={post.id} className="mx-1 p-2">
              <PostObject {...postJSON} key={post.id} />
            </div>
          );
        })}
      </div>
    </>
  );
};

export default PostFeed;
