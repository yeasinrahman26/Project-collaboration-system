"use client";

import { useDispatch, useSelector } from "react-redux";
import {
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useGetHighPriorityTasksQuery,
  useGetUpcomingDeadlinesQuery,
  useGetOverdueTasksQuery,
} from "../redux/services/tasksApi";
import {
  setTasks,
  setCurrentTask,
  setFilters,
  setPagination,
  addTask,
  updateTask,
  deleteTask,
} from "../redux/slices/tasksSlice";
import { useCallback } from "react";
import { TASK_STATUS } from "../utils/constants";

export const useTasks = () => {
  const dispatch = useDispatch();
  const tasksState = useSelector((state) => state.tasks);

  const {
    data: tasksData,
    isLoading,
    error,
    refetch,
  } = useGetTasksQuery({
    projectId: tasksState.filters.projectId,
    status: tasksState.filters.status,
    priority: tasksState.filters.priority,
    assignedTo: tasksState.filters.assignedTo,
    sort: tasksState.filters.sort,
    page: tasksState.filters.page,
  });

  const { data: highPriorityTasks } = useGetHighPriorityTasksQuery();
  const { data: upcomingDeadlines } = useGetUpcomingDeadlinesQuery();
  const { data: overdueTasks } = useGetOverdueTasksQuery();

  const [createMutation] = useCreateTaskMutation();
  const [updateMutation] = useUpdateTaskMutation();
  const [deleteMutation] = useDeleteTaskMutation();

  // Update state when data changes
  if (tasksData && tasksData.tasks) {
    dispatch(setTasks(tasksData.tasks));
    dispatch(setPagination(tasksData.pagination));
  }

  const createTask = useCallback(
    async (taskData) => {
      try {
        const response = await createMutation(taskData).unwrap();
        dispatch(addTask(response.task));
        return response;
      } catch (error) {
        throw error;
      }
    },
    [createMutation, dispatch],
  );

  const updateTaskData = useCallback(
    async (id, taskData) => {
      try {
        const response = await updateMutation({ id, ...taskData }).unwrap();
        dispatch(updateTask(response.task));
        return response;
      } catch (error) {
        throw error;
      }
    },
    [updateMutation, dispatch],
  );

  const deleteTaskData = useCallback(
    async (id) => {
      try {
        await deleteMutation(id).unwrap();
        dispatch(deleteTask(id));
      } catch (error) {
        throw error;
      }
    },
    [deleteMutation, dispatch],
  );

  const changeTaskStatus = useCallback(
    async (id, newStatus) => {
      return updateTaskData(id, { status: newStatus });
    },
    [updateTaskData],
  );

  const assignTask = useCallback(
    async (id, memberId) => {
      return updateTaskData(id, { assignedTo: memberId });
    },
    [updateTaskData],
  );

  const setTaskFilters = useCallback(
    (filters) => {
      dispatch(setFilters(filters));
    },
    [dispatch],
  );

  // Organize tasks by status for Kanban
  const getKanbanData = useCallback(() => {
    const tasks = tasksState.list;
    return {
      [TASK_STATUS.TODO]: tasks.filter((t) => t.status === TASK_STATUS.TODO),
      [TASK_STATUS.IN_PROGRESS]: tasks.filter(
        (t) => t.status === TASK_STATUS.IN_PROGRESS,
      ),
      [TASK_STATUS.COMPLETED]: tasks.filter(
        (t) => t.status === TASK_STATUS.COMPLETED,
      ),
    };
  }, [tasksState.list]);

  return {
    tasks: tasksState.list,
    currentTask: tasksState.currentTask,
    isLoading,
    error,
    filters: tasksState.filters,
    pagination: tasksState.pagination,
    highPriorityTasks: highPriorityTasks || [],
    upcomingDeadlines: upcomingDeadlines || [],
    overdueTasks: overdueTasks || [],
    createTask,
    updateTask: updateTaskData,
    deleteTask: deleteTaskData,
    changeTaskStatus,
    assignTask,
    setFilters: setTaskFilters,
    getKanbanData,
    refetch,
  };
};
