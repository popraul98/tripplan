import {createSlice} from "@reduxjs/toolkit";

export const userSlice = createSlice({
    name: "user",
    initialState: {
        user: null,
        tokens: null,
    },
    reducers: {
        login: (state, action) => {
            state.user = action.payload;
        },
        authorization: (state, action) => {
            state.tokens = action.payload;
        },
        logout: (state) => {
            state.user = null;
        },
    },
});

export const {login, logout, authorization} = userSlice.actions;

export const selectUser = (state) => state.user.user;
export const selectTokens = (state) => state.user.tokens;

export default userSlice.reducer;