import { SearchResults } from "@/components/Search";
import SearchBar from "@/components/Search/SearchResults";
import React from "react";

const page = () => {
  return (
    <div>
      <SearchBar />
      <SearchResults />
    </div>
  );
};

export default page;
