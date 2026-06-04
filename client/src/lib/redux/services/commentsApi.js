import { baseApi } from "../baseApi";

export const commentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getComments: builder.query({
      query: ({ taskId, page = 1, limit = 10 }) =>
        `/comments/${taskId}/comments?page=${page}&limit=${limit}`,
      providesTags: ["Comments"],
    }),

    addComment: builder.mutation({
      query: ({ taskId, text }) => ({
        url: `/comments/${taskId}/comments`,
        method: "POST",
        body: { text },
      }),
      invalidatesTags: ["Comments"],
    }),

    deleteComment: builder.mutation({
      query: (commentId) => ({
        url: `/comments/${commentId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Comments"],
    }),
  }),
});

export const {
  useGetCommentsQuery,
  useAddCommentMutation,
  useDeleteCommentMutation,
} = commentsApi;
