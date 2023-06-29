import { useSearchParams } from "next/navigation";
import { api } from "~/utils/api";

const SearchPage = () => {
  const search = useSearchParams();
  const searchQuery = search ? search.get("q") : null;

  const encodedSearchQuery = encodeURI(searchQuery || "");
  const { data, isLoading: postsLoading } = api.posts.getByTitle.useQuery({
    queryString: encodedSearchQuery,
  });

  // TODO : do something with the return objects, probably display in datafeed.

  console.log(data);

  return (
    <>
      <p>You are searching for something...</p>
    </>
  );
};

export default SearchPage;
