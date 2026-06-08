"use client";

import { useState, useEffect } from "react";
import { useTasks, useProjects } from "@/lib/hooks";
import { TASK_STATUS, TASK_PRIORITY } from "@/lib/utils/constants";
import { Search, Filter, X } from "lucide-react";

export function TaskFilters() {
  const { filters, setFilters } = useTasks();
  const { projects } = useProjects();
  const [searchQuery, setSearchQuery] = useState("");
  const [debounceTimer, setDebounceTimer] = useState(null);

  // Debounce search - 500ms delay
  useEffect(() => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    const timer = setTimeout(() => {
      setFilters({
        search: searchQuery.trim(),
        page: 1,
      });
    }, 500);

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDebounceTimer(timer);

    return () => clearTimeout(timer);
  }, [searchQuery, setFilters]);

  const handleStatusChange = (status) => {
    setFilters({
      status: filters.status === status ? "" : status,
      page: 1,
    });
  };

  const handlePriorityChange = (priority) => {
    setFilters({
      priority: filters.priority === priority ? "" : priority,
      page: 1,
    });
  };

  const handleProjectChange = (projectId) => {
    setFilters({
      projectId: filters.projectId === projectId ? "" : projectId,
      page: 1,
    });
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setFilters({
      search: "",
      page: 1,
    });
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setFilters({
      status: "",
      priority: "",
      projectId: "",
      sort: "createdAt",
      page: 1,
      search: "",
    });
  };

  const hasActiveFilters =
    filters.status || filters.priority || filters.projectId || searchQuery;

  return (
    <div className="space-y-4 mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
      {/* Search Bar */}
      <div className="relative">
        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search tasks by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent outline-none text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition"
              title="Clear search"
            >
              <X size={18} className="text-gray-500" />
            </button>
          )}
        </div>
        {searchQuery && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Searching for: <span className="font-medium">{searchQuery}</span>
          </p>
        )}
      </div>

      {/* Filter Groups */}
      <div className="space-y-3">
        {/* Status Filter */}
        <div>
          <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2 block">
            Status
          </label>
          <div className="flex flex-wrap gap-2">
            {Object.values(TASK_STATUS).map((status) => (
              <button
                key={status}
                onClick={() => handleStatusChange(status)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition ${
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

        {/* Priority Filter */}
        <div>
          <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2 block">
            Priority
          </label>
          <div className="flex flex-wrap gap-2">
            {Object.values(TASK_PRIORITY).map((priority) => (
              <button
                key={priority}
                onClick={() => handlePriorityChange(priority)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                  filters.priority === priority
                    ? "bg-secondary text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                {priority}
              </button>
            ))}
          </div>
        </div>

        {/* Project Filter */}
        <div>
          <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2 block">
            Project
          </label>
          <select
            value={filters.projectId || ""}
            onChange={(e) => handleProjectChange(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white text-sm border-none outline-none"
          >
            <option value="">All Projects</option>
            {projects.map((project) => (
              <option key={project._id} value={project._id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Dropdown */}
        <div>
          <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2 block">
            Sort By
          </label>
          <select
            value={filters.sort}
            onChange={(e) => setFilters({ sort: e.target.value })}
            className="w-full px-3 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white text-sm border-none outline-none"
          >
            <option value="createdAt">Latest</option>
            <option value="dueDate">Deadline</option>
            <option value="priority">Priority</option>
            <option value="updatedAt">Recently Updated</option>
          </select>
        </div>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <button
          onClick={handleClearFilters}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-error hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition"
        >
          <X size={16} />
          Clear All Filters & Search
        </button>
      )}
    </div>
  );
}
