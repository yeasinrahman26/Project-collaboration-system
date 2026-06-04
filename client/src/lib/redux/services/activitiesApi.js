import { baseApi } from "../baseApi";

export const activitiesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getActivities: builder.query({
      query: ({ limit = 10, page = 1 } = {}) =>
        `/activities?limit=${limit}&page=${page}`,
      providesTags: ["Activities"],
    }),
  }),
});

export const { useGetActivitiesQuery } = activitiesApi;