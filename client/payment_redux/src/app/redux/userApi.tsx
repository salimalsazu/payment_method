import { argv } from "process";
import { apiSlice } from "./ApiSlice";

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUser: builder.query({
      query: () => "/users",
      providesTags: ["User"],
    }),

    addUser: builder.mutation({
      query: (data) => ({
        url: "/auth/create-user",
        method: "POST",
        body: data,
      }),
      // invalidatesTags: ["User"],
      async onQueryStarted(arg, { dispatch }) {
        setTimeout(() => {
          dispatch(apiSlice.util.invalidateTags(["User"]));
        }, 3000); // 3000ms = 3 seconds
      },
    }),
  }),
});

export const { useAddUserMutation, useGetUserQuery } = userApi;
