import { useRouter } from "next/navigation";
import { useState } from "react";

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const router = useRouter();

  const onSearch = (event: React.FormEvent) => {
    event.preventDefault();

    const encodedSearch = encodeURIComponent(searchQuery);
    //router.push(`/search?q=${encodedSearch}`);
  };

  return (
    <>
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
        >
          Search
        </button>
      </form>
    </>
  );
};

export default SearchBar;
