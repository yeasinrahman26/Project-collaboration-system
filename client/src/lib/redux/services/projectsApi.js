import { baseApi } from "../baseApi";

export const projectsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProjects: builder.query({
      query: ({
        status = "",
        sort = "createdAt",
        page = 1,
        limit = 10,
      } = {}) => {
        let url = `/projects?page=${page}&limit=${limit}&sort=${sort}`;
        if (status) url += `&status=${status}`;
        return url;
      },
      providesTags: ["Projects"],
    }),

    getProjectById: builder.query({
      query: (id) => `/projects/${id}`,
      providesTags: ["Projects"],
    }),

    createProject: builder.mutation({
      query: (projectData) => ({
        url: "/projects",
        method: "POST",
        body: projectData,
      }),
      invalidatesTags: ["Projects"],
    }),

    updateProject: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/projects/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Projects"],
    }),

    deleteProject: builder.mutation({
      query: (id) => ({
        url: `/projects/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Projects"],
    }),

    addMember: builder.mutation({
      query: (data) => ({
        url: "/projects/add-member",
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { projectId }) => [
        { type: "Projects", id: projectId },
        "Projects",
      ],
    }),

    removeMember: builder.mutation({
      query: (data) => ({
        url: "/projects/remove-member",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Projects"],
    }),

    getProjectStats: builder.query({
      query: (projectId) => `/projects/${projectId}/stats`,
      providesTags: ["Projects"],
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useGetProjectByIdQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useAddMemberMutation,
  useRemoveMemberMutation,
  useGetProjectStatsQuery,
} = projectsApi;
