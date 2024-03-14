import { apiSlice } from "../api/apiSlice";
import { logedIn } from "./authSlice";

export const authApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        register: builder.mutation({
            query: (data) => ({
                url: "/register",
                method: "POST",
                body: data
            }),
            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                //onQueryStarted maddome dependance kaj gula kra hy.jmn ami reg korar somoy accesstoken localstorage o redux store e  store krte partm..ta na kre ami ekhne krlm
                try {
                    const result = await queryFulfilled;
                    localStorage.setItem('auth', JSON.stringify({
                        accessToken: result.data.accessToken,
                        user: result.data.user
                    }));
                    dispatch(logedIn({
                        accessToken: result.data.accessToken,
                        user: result.data.user
                    }))
                }
                catch (err) {
                    // no need
                }

            }
        }),
        login: builder.mutation({
            query: (data) => ({
                url: '/login',
                method: "POST",
                body: data
            }),
            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                try {
                    const result = await queryFulfilled;
                    localStorage.setItem('auth', JSON.stringify({
                        accessToken: result.data.accessToken,
                        user: result.data.user
                    }));
                    dispatch(logedIn({
                        accessToken: result.data.accessToken,
                        user: result.data.user
                    }))

                } catch (err) {
                    // no need 
                }
            }
        })
    })
})
export const { useLoginMutation, useRegisterMutation } = authApi;