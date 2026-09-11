import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import FinancePostObject from "~/components/financePostObject";
import { useUser } from "@clerk/nextjs";
import { LoadingPage } from "./loadingspinner";
import { convertJSONtoArray, combineJSONObjects } from "../server/helpers/dataHelper";

const FinancePostFeed = () => {
  const { user } = useUser();
  if (!user) return null;

  const userId = user.id;
  const profile_image_url = user.profileImageUrl;

  const { data: initialData, isLoading: postsLoading } =
    api.financePosts.getAll.useQuery();

  const { data: initialLikedPosts, isLoading: likedPostsLoading } =
    api.financelikedPosts.getAllIDs.useQuery();

  const [searchTrigger, setSearchTrigger] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const encodedSearch = encodeURIComponent(searchQuery);
  const { data: filteredData, isLoading: filteredPostsLoading } =
    api.financePosts.getByTitle.useQuery({ queryString: encodedSearch });

  const [data, setData] = useState(initialData);
  const user_profile = api.profile.getById.useQuery({ id: userId });
  const { mutate } = api.profile.insertNewUser.useMutation({});
  const [dataFetched, setDataFetched] = useState(false);
  const [likedPosts, setLikedPosts] = useState<number[]>([]);

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  useEffect(() => {
    if (likedPostsLoading || initialLikedPosts === undefined) return;
    const arr = convertJSONtoArray(JSON.stringify(initialLikedPosts), "post_id");
    setLikedPosts(arr);
  }, [initialLikedPosts]);

  useEffect(() => {
    if (filteredPostsLoading) return;
    setData(filteredData);
  }, [searchTrigger]);

  useEffect(() => {
    if (user_profile.isLoading) return;
    if (user_profile.data === null && !dataFetched) {
      mutate(
        { profile_image_url },
        {
          onSuccess: () => setDataFetched(true),
          onError: () => setDataFetched(true),
        }
      );
    } else if (user_profile.data) {
      setDataFetched(true);
    }
  }, [user_profile.isLoading, user_profile.data, dataFetched]);

  const onSearch = (event: React.FormEvent) => {
    event.preventDefault();
    setSearchTrigger(!searchTrigger);
    setData(data);
  };

  if (postsLoading) return <LoadingPage />;
  if (!data) return <p className="m-4">no data found</p>;

  return (
    <>
      <div className="mb-4 ml-4 flex w-11/12 items-center shadow-md">
        <form className="flex w-full items-center" onSubmit={onSearch}>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            type="text"
            placeholder="Search"
            className="w-11/12 rounded-l-md bg-slate-100 px-4 py-2 focus:border-[#627264] focus:outline-none focus:ring-2 focus:ring-[#627264]"
          />
          <button
            type="button"
            className="rounded-r-md bg-[#627264] px-4 py-2 text-white transition-colors hover:bg-[#4f5d51]"
            onClick={onSearch}
          >
            Search
          </button>
        </form>
      </div>
      <div className="m-2 flex flex-wrap">
        {data.map((post) => {
          const liked = likedPosts.includes(post.id) ? 1 : 0;
          const likedJSON = `{"liked":${liked}}`;
          const postObject = JSON.parse(combineJSONObjects(JSON.stringify(post), likedJSON));
          return (
            <div key={post.id} className="mx-1 p-2">
              <FinancePostObject {...postObject} key={post.id} />
            </div>
          );
        })}
      </div>
    </>
  );
};

export default FinancePostFeed;
