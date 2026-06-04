import { baseApi } from "../baseApi";

export const searchApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    searchProjects: builder.query({
      query: (query) => `/search/projects?query=${query}`,
      providesTags: ["Projects"],
    }),

    searchTasks: builder.query({
      query: (query) => `/search/tasks?query=${query}`,
      providesTags: ["Tasks"],
    }),

    searchMembers: builder.query({
      query: (query) => `/search/members?query=${query}`,
    }),
  }),
});

export const {
  useSearchProjectsQuery,
  useSearchTasksQuery,
  useSearchMembersQuery,
} = searchApi;
