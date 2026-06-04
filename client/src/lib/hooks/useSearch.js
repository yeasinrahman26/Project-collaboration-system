"use client";

import { useState, useCallback } from "react";
import {
  useSearchProjectsQuery,
  useSearchTasksQuery,
  useSearchMembersQuery,
} from "../redux/services/searchApi";

export const useSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("all"); // 'all', 'projects', 'tasks', 'members'

  const { data: projectsResults = [] } = useSearchProjectsQuery(searchQuery, {
    skip: !searchQuery || (searchType !== "all" && searchType !== "projects"),
  });

  const { data: tasksResults = [] } = useSearchTasksQuery(searchQuery, {
    skip: !searchQuery || (searchType !== "all" && searchType !== "tasks"),
  });

  const { data: membersResults = [] } = useSearchMembersQuery(searchQuery, {
    skip: !searchQuery || (searchType !== "all" && searchType !== "members"),
  });

  const clearSearch = useCallback(() => {
    setSearchQuery("");
  }, []);

  const getResults = useCallback(() => {
    if (!searchQuery) return { projects: [], tasks: [], members: [] };

    switch (searchType) {
      case "projects":
        return { projects: projectsResults, tasks: [], members: [] };
      case "tasks":
        return { projects: [], tasks: tasksResults, members: [] };
      case "members":
        return { projects: [], tasks: [], members: membersResults };
      default:
        return {
          projects: projectsResults,
          tasks: tasksResults,
          members: membersResults,
        };
    }
  }, [searchQuery, searchType, projectsResults, tasksResults, membersResults]);

  return {
    searchQuery,
    setSearchQuery,
    searchType,
    setSearchType,
    results: getResults(),
    hasResults: searchQuery.length > 0,
    clearSearch,
  };
};
