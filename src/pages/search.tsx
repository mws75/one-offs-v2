import { useSearchParams } from "next/navigation";

const SearchPage = () => {
  const search = useSearchParams();
  const searchQuery = search ? search.get("q") : null;

  const encodedSearchQuery = encodeURI(searchQuery || "");

  return (
    <>
      <p>You are searching for something...</p>
    </>
  );
};

export default SearchPage;
