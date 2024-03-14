import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logedOut } from "../auth/authSlice";
const baseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_KEY,
    prepareHeaders: async (headers, { getState, endpoint }) => {
        const token = getState()?.auth?.accessToken;
        if (token) {
            headers.set('authorization', `Bearer ${token}`);
        }
        return headers;

    }
})
export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: async (args, api, extraOptions) => {
        let result = await baseQuery(args, api, extraOptions);
        if (result?.error?.status === 401) {
            api.dispatch(logedOut());
            localStorage.clear();
        }
        return result;
    },
    tagTypes: ["message", "conversations", "conversation"],

    endpoints: (builder) => ({})
})
