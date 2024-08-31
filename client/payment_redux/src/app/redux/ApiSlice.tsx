import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

console.log(process.env.NEXT_PUBLIC_API_BASE_URL);

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  }),
  tagTypes: ["User"],
  // tagTypes: [],
  endpoints: (builder) => ({}),
});
