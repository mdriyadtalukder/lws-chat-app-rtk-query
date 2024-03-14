import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    accessToken: undefined,
    user: undefined
};
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logedIn: (state, action) => {
            state.accessToken = action.payload.accessToken;
            state.user = action.payload.user;
        },
        logedOut: (state, action) => {
            state.accessToken = undefined;
            state.user = undefined;
        }

    }
});
export default authSlice.reducer;
export const { logedIn, logedOut } = authSlice.actions;