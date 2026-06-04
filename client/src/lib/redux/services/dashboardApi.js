import { baseApi } from "../baseApi";

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query({
      query: () => "/dashboard/stats",
      providesTags: ["Dashboard"],
    }),

    getProjectSummary: builder.query({
      query: () => "/dashboard/projects-summary",
      providesTags: ["Dashboard"],
    }),

    getTaskStatusDistribution: builder.query({
      query: () => "/dashboard/task-distribution",
      providesTags: ["Dashboard"],
    }),

    getMemberWorkload: builder.query({
      query: (memberId) => `/dashboard/member/${memberId}/workload`,
      providesTags: ["Dashboard"],
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetProjectSummaryQuery,
  useGetTaskStatusDistributionQuery,
  useGetMemberWorkloadQuery,
} = dashboardApi;
