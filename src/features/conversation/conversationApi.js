import { io } from "socket.io-client";
import { apiSlice } from "../api/apiSlice";
import { messageApi } from "../message/messageApi";

export const conversationApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCoversation: builder.query({
            query: (email) => ({
                url: `/conversations?participants_like=${email}&_sort=timestamp&_order=desc&_page=1&_limit=${import.meta.env.VITE_CONVERSATION_LIMIT}`,
                method: "GET"
            }),
            providesTags: ["conversations"],
            //get total of array of object
            transformResponse(apiResponse, meta) {
                const totalCounter = meta.response.headers.get("X-Total-Count"); //array of object
                return {
                    data: apiResponse, totalCounter,
                }
            },
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
                    socket.on("conversation", data => {
                        updateCachedData(draft => {
                            const conversation = draft?.data.find(c => c?.id == data?.data?.id);
                            if (conversation?.id) {
                                conversation.message = data?.data?.message;
                                conversation.timestamp = data?.data?.timestamp;
                            }
                            else {
                                //
                            }
                        })
                    })

                } catch (error) {
                    //
                }
                await cacheEntryRemoved;
                socket.close();
            }
        }),
        getMoreCoversation: builder.query({
            query: ({ email, page }) => ({
                url: `/conversations?participants_like=${email}&_sort=timestamp&_order=desc&_page=${page}&_limit=${import.meta.env.VITE_CONVERSATION_LIMIT}`,
                method: "GET"
            }),
            async onQueryStarted(email, { queryFulfilled, dispatch }) {
                try {
                    //dependence kaj
                    const conversations = await queryFulfilled;
                    if (conversations?.data?.length > 0) {



                        dispatch(apiSlice.util.updateQueryData("getCoversation", email, (draft) => {

                            return {
                                data: [...draft.data, ...conversations.data],
                                totalCounter: Number(draft.totalCounter)
                            }

                        }));


                    }
                } catch (error) {
                    //
                }


            }
        }),
        getAcoversation: builder.query({
            query: ({ userEmail, participantEmail }) => ({
                url: `/conversations?participants_like=${userEmail}-${participantEmail}&participants_like=${participantEmail}-${userEmail}`,
                method: "GET"
            }),
        }),

        addCoversation: builder.mutation({
            query: ({ sender, data }) => ({
                url: '/conversations',
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["message", "conversations" ],
            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                const pathResult2 = dispatch(apiSlice.util.updateQueryData("getCoversation", arg.sender, (draft) => {
                    draft.data?.push(arg?.data)

                }));
                try {
                    const conversation = await queryFulfilled;
                    if (conversation?.data?.id) {
                        const users = arg.data?.users;
                        const senderUser = users.find((user) => user?.email === arg?.sender);
                        const recieverUser = users.find((user) => user?.email !== arg?.sender);
                        const res = await dispatch(messageApi.endpoints.addMessage.initiate({
                            conversationId: conversation?.data?.id,
                            sender: senderUser,
                            receiver: recieverUser,
                            message: arg?.data?.message,
                            timestamp: arg?.data?.timestamp
                        }
                        )).unwrap();
                        //pessimistic update

                        dispatch(apiSlice.util.updateQueryData("getCoversation", res.conversationId.toString(), (draft) => {
                            draft.push(res);

                        }));

                    }
                } catch (error) {
                    pathResult2.undo();
                }

            }
        }),
        editCoversation: builder.mutation({
            query: ({ sender, id, data }) => ({
                url: `/conversations/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags:  ["message", "conversations"],
            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                //update
                const pathResult1 = dispatch(apiSlice.util.updateQueryData("getCoversation", arg.sender, (draft) => {
                    const daftConversation = draft.data?.find((d) => d?.id == arg.id); ////get total of array of object er karone draft.data.
                    daftConversation.message = arg.data.message;
                    daftConversation.timestamp = arg.data.timestamp;

                }));
                try {
                    //dependence kaj
                    const conversation = await queryFulfilled;
                    if (conversation?.data?.id) {
                        const users = arg.data?.users;
                        const senderUser = users.find((user) => user?.email === arg?.sender);
                        const recieverUser = users.find((user) => user?.email !== arg?.sender);
                        const res = await dispatch(messageApi.endpoints.addMessage.initiate({
                            conversationId: conversation?.data?.id,
                            sender: senderUser,
                            receiver: recieverUser,
                            message: arg?.data?.message,
                            timestamp: arg?.data?.timestamp
                        }
                        )).unwrap();

                        //pessimistic update

                        dispatch(apiSlice.util.updateQueryData("getMessages", res.conversationId.toString(), (draft) => {
                            draft.push(res);

                        }));


                    }
                } catch (error) {
                    pathResult1.undo();
                }


            }
        }),
    })
})
export const { useGetCoversationQuery, useGetAcoversationQuery, useAddCoversationMutation, useEditCoversationMutation, useGetMoreCoversationQuery } = conversationApi;