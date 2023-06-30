import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import PostObject from "~/components/postobject";
import { useUser } from "@clerk/nextjs";
import { LoadingPage } from "./loadingspinner";
import { serialize } from "v8";

// Do something like this: https://react.dev/learn/updating-arrays-in-state

const PostFeed = () => {
  const { user } = useUser();
  if (!user) return null;

  const userId = user.id;
  const profile_image_url = user.profileImageUrl;

  const { data: initialData, isLoading: postsLoading } =
    api.posts.getAll.useQuery();

  const [searchTrigger, setSearchTrigger] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const encodedSearch = encodeURIComponent(searchQuery);
  const { data: filteredData } = api.posts.getByTitle.useQuery({
    queryString: encodedSearch,
  });

  const [data, setData] = useState(initialData);
  const user_profile = api.profile.getById.useQuery({ id: userId });
  const { mutate } = api.profile.insertNewUser.useMutation({});
  const [dataFeteched, setDataFetched] = useState(false);

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  useEffect(() => {
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
    console.log("searching...");
    event.preventDefault();
    setSearchTrigger(!searchTrigger);
    setData(data);
  };

  if (postsLoading) {
    return <LoadingPage />;
  }
  if (!data) {
    return <p>No posts found</p>;
  }

  return (
    <>
      <div className="ml-4 flex w-11/12 items-center shadow-md">
        <form className="flex w-11/12 items-center" onSubmit={onSearch}>
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
        {data.map((post) => (
          <div key={post.id} className="mx-1 p-2">
            <PostObject {...post} key={post.id} />
          </div>
        ))}
      </div>
    </>
  );
};

export default PostFeed;
