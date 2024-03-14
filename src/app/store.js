import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "../features/api/apiSlice";
import authSlice from "../features/auth/authSlice";
import conversationSlice from "../features/conversation/conversationSlice";
import messageSlice from "../features/message/messageSlice";

export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth: authSlice,
        conversation: conversationSlice,
        message: messageSlice,
    },
    devTools: import.meta.env.NODE_ENV !== 'production', //MODE
    middleware: (getDefaultMiddlewares) =>
        getDefaultMiddlewares().concat(apiSlice.middleware)
})