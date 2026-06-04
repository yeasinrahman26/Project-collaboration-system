"use client";

import { useDispatch, useSelector } from "react-redux";
import {
  useGetProjectsQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useAddMemberMutation,
} from "../redux/services/projectsApi";
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

  const {
    data: projectsData,
    isLoading,
    error,
    refetch,
  } = useGetProjectsQuery({
    status: projectsState.filters.status,
    sort: projectsState.filters.sort,
    page: projectsState.filters.page,
  });

  const [createMutation] = useCreateProjectMutation();
  const [updateMutation] = useUpdateProjectMutation();
  const [deleteMutation] = useDeleteProjectMutation();
  const [addMemberMutation] = useAddMemberMutation();

  // Update state when data changes
  if (projectsData && projectsData.projects) {
    dispatch(setProjects(projectsData.projects));
    dispatch(setPagination(projectsData.pagination));
  }

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
    refetch,
  };
};
