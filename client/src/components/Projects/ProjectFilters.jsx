"use client";

import { useProjects } from "@/lib/hooks";
import { PROJECT_STATUS } from "@/lib/utils/constants";
import { Search, Filter, X } from "lucide-react";
import { useState, useCallback } from "react";

export function ProjectFilters() {
  const { filters, setFilters } = useProjects();
  const [searchInput, setSearchInput] = useState("");

  const handleSearchChange = useCallback(
    (value) => {
      setSearchInput(value);
      // Reset to page 1 when searching
      setFilters({ search: value || "", page: 1 });
    },
    [setFilters],
  );

  const handleStatusChange = (status) => {
    setFilters({ status: filters.status === status ? "" : status, page: 1 });
  };

  const handleSortChange = (sort) => {
    setFilters({ sort });
  };

  const handleClearFilters = () => {
    setSearchInput("");
    setFilters({ status: "", sort: "createdAt", page: 1, search: "" });
  };

  const hasActiveFilters =
    filters.status || filters.sort !== "createdAt" || filters.search;

  return (
    <div className="space-y-4 mb-6">
      {/* Search Bar */}
      <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700">
        <Search size={18} className="text-gray-400" />
        <input
          type="text"
          placeholder="Search projects..."
          value={searchInput}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="flex-1 bg-transparent outline-none text-sm text-gray-900 dark:text-white placeholder-gray-400"
        />
        {searchInput && (
          <button
            onClick={() => handleSearchChange("")}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-gray-600 dark:text-gray-400" />
          <div className="flex gap-2">
            {Object.values(PROJECT_STATUS).map((status) => (
              <button
                key={status}
                onClick={() => handleStatusChange(status)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                  filters.status === status
                    ? "bg-primary text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Sort Dropdown */}
        <select
          value={filters.sort}
          onChange={(e) => handleSortChange(e.target.value)}
          className="px-3 py-1 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white text-sm font-medium border-none outline-none"
        >
          <option value="createdAt">Latest</option>
          <option value="deadline">Deadline</option>
          <option value="name">Name</option>
        </select>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="flex items-center gap-1 px-3 py-1 text-sm font-medium text-error hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition"
          >
            <X size={16} />
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
