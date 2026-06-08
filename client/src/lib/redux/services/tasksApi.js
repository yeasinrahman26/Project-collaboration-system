import { baseApi } from "../baseApi";

export const tasksApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTasks: builder.query({
      query: ({
        projectId = "",
        status = "",
        priority = "",
        assignedTo = "",
        sort = "createdAt",
        page = 1,
        limit = 10,
        myTasks = false,
        search = "", // NEW
      } = {}) => {
        let url = `/tasks?page=${page}&limit=${limit}&sort=${sort}`;
        if (projectId) url += `&projectId=${projectId}`;
        if (status) url += `&status=${status}`;
        if (priority) url += `&priority=${priority}`;
        if (assignedTo) url += `&assignedTo=${assignedTo}`;
        if (myTasks) url += `&myTasks=true`;
        if (search) url += `&search=${encodeURIComponent(search)}`; // NEW
        return url;
      },
      providesTags: ["Tasks"],
    }),

    getTaskById: builder.query({
      query: (id) => `/tasks/${id}`,
      providesTags: ["Tasks"],
    }),

    createTask: builder.mutation({
      query: (taskData) => ({
        url: "/tasks",
        method: "POST",
        body: taskData,
      }),
      invalidatesTags: ["Tasks"],
    }),

    updateTask: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/tasks/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Tasks"],
    }),

    deleteTask: builder.mutation({
      query: (id) => ({
        url: `/tasks/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Tasks"],
    }),

    getHighPriorityTasks: builder.query({
      query: () => "/tasks/priority/high",
      providesTags: ["Tasks"],
    }),

    getUpcomingDeadlines: builder.query({
      query: (days = 7) => `/tasks/deadline/upcoming?days=${days}`,
      providesTags: ["Tasks"],
    }),

    getOverdueTasks: builder.query({
      query: () => "/tasks/deadline/overdue",
      providesTags: ["Tasks"],
    }),
  }),
});

export const {
  useGetTasksQuery,
  useGetTaskByIdQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useGetHighPriorityTasksQuery,
  useGetUpcomingDeadlinesQuery,
  useGetOverdueTasksQuery,
} = tasksApi;
