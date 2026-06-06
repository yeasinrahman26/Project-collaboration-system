"use client";

import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { useSearch } from "@/lib/hooks";
import { Input } from "@/components/Common";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const { search, isLoading } = useSearch();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        search(query);
      }
    }, 300); // Debounce 300ms

    return () => clearTimeout(timer);
  }, [query, search]);

  const handleClear = () => {
    setQuery("");
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="relative flex items-center">
        <Search className="absolute left-3 w-5 h-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Search projects, tasks, members..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 pr-10"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {isLoading && (
        <div className="absolute top-full left-0 right-0 mt-1 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg text-sm text-gray-600 dark:text-gray-400">
          Searching...
        </div>
      )}
    </div>
  );
}
