import { io } from "socket.io-client";
import { apiSlice } from "../api/apiSlice";

export const messageApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getMessages: builder.query({
            query: (id) => ({
                url: `/messages?conversationId=${id}&_sort=timestamp&_order=desc&_page=1&_limit=5`,
                method: "GET",
            }),
            providesTags:['message'],
            
            //socket
                async onCacheEntryAdded(arg, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
                    const socket = io('http://localhost:9000/', {
                        reconnectionDelay: 1000,
                        reconnection: true,
                        reconnectionAttempts: 10,
                        transports: ['websocket'],
                        agent: false,
                        upgrade: false,
                        rejectUnauthorized: false,
                    });
                    try {
                        await cacheDataLoaded;
                        socket.on("message", data => {
                            updateCachedData(draft => {
                                draft.push(data?.data);
                            })
                        })

                    } catch (error) {
                        //
                    }
                    await cacheEntryRemoved;
                    socket.close();
                }
        }),
        addMessage: builder.mutation({
            query: (data) => ({
                url: '/messages',
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["message","conversations"]
        }),
    })
})
export const { useGetMessagesQuery, useAddMessageMutation } = messageApi;