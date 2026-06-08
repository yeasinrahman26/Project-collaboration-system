"use client";

import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  useGetProjectsQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useAddMemberMutation,
} from "../redux/services/projectsApi";
import { useSearchProjectsQuery } from "../redux/services/searchApi"; // Add this
import {
  setProjects,
  setCurrentProject,
  setFilters,
  setPagination,
  addProject,
  updateProject,
  deleteProject,
} from "../redux/slices/projectsSlice";
import { useCallback } from "react";

export const useProjects = () => {
  const dispatch = useDispatch();
  const projectsState = useSelector((state) => state.projects);

  // Determine if we're searching or getting all projects
  const isSearching = !!projectsState.filters.search;

  // Use search query if search is active, otherwise use regular query
  const { data: searchData, isLoading: isSearchLoading } =
    useSearchProjectsQuery(projectsState.filters.search, {
      skip: !isSearching, // Skip if not searching
    });

  const {
    data: projectsData,
    isLoading: isProjectsLoading,
    error,
    refetch,
  } = useGetProjectsQuery(
    {
      status: projectsState.filters.status,
      sort: projectsState.filters.sort,
      page: projectsState.filters.page,
    },
    {
      skip: isSearching, // Skip if searching
    },
  );

  const [createMutation] = useCreateProjectMutation();
  const [updateMutation] = useUpdateProjectMutation();
  const [deleteMutation] = useDeleteProjectMutation();
  const [addMemberMutation] = useAddMemberMutation();

  // Handle both search and regular results
  useEffect(() => {
    if (isSearching && searchData) {
      // For search results, don't use pagination
      dispatch(setProjects(searchData));
      dispatch(setPagination({ page: 1, pages: 1 }));
    } else if (projectsData && projectsData.projects) {
      dispatch(setProjects(projectsData.projects));
      dispatch(setPagination(projectsData.pagination));
    }
  }, [projectsData, searchData, isSearching, dispatch]);

  const createProject = useCallback(
    async (projectData) => {
      try {
        const response = await createMutation(projectData).unwrap();
        dispatch(addProject(response.project));
        return response;
      } catch (error) {
        throw error;
      }
    },
    [createMutation, dispatch],
  );

  const updateProjectData = useCallback(
    async (id, projectData) => {
      try {
        const response = await updateMutation({ id, ...projectData }).unwrap();
        dispatch(updateProject(response.project));
        return response;
      } catch (error) {
        throw error;
      }
    },
    [updateMutation, dispatch],
  );

  const deleteProjectData = useCallback(
    async (id) => {
      try {
        await deleteMutation(id).unwrap();
        dispatch(deleteProject(id));
      } catch (error) {
        throw error;
      }
    },
    [deleteMutation, dispatch],
  );

  const addMemberToProject = useCallback(
    async (projectId, memberId) => {
      try {
        const response = await addMemberMutation({
          projectId,
          memberId,
        }).unwrap();
        dispatch(updateProject(response.project));
        return response;
      } catch (error) {
        throw error;
      }
    },
    [addMemberMutation, dispatch],
  );

  const setProjectFilters = useCallback(
    (filters) => {
      dispatch(setFilters(filters));
    },
    [dispatch],
  );

  const setPage = useCallback(
    (page) => {
      dispatch(setFilters({ page }));
    },
    [dispatch],
  );

  const isLoading = isSearching ? isSearchLoading : isProjectsLoading;

  return {
    projects: projectsState.list,
    currentProject: projectsState.currentProject,
    isLoading,
    error,
    filters: projectsState.filters,
    pagination: projectsState.pagination,
    createProject,
    updateProject: updateProjectData,
    deleteProject: deleteProjectData,
    addMemberToProject,
    setFilters: setProjectFilters,
    setPage,
    refetch,
  };
};
