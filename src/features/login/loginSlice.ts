import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Credentials, User} from "./loginIntefaces";

import axios, {AxiosResponse} from 'axios';
import {Dispatch} from 'redux';
import {FullState} from "../../app/store";
import {todoListSlice} from "../todo/todoListSlice";
import {BASE_BACKEND_URL, LOGIN_BASE_URL} from "../../App";


export const loginSlice = createSlice({
    name: 'counter',
    initialState: {
        user: {},
        serverSideErrorMessage: ""
    },
    reducers: {
        setUser: (state, action: PayloadAction<User | {}>) => {
            state.user = action.payload;
        },
        setServerSideErrorMessage: (state, action: PayloadAction<string>) => {
            state.serverSideErrorMessage = action.payload;
        }

    },
});

export const {setUser, setServerSideErrorMessage} = loginSlice.actions;

export const signOut = () => (dispatch: Dispatch) => {
    localStorage.removeItem("user");
    dispatch(loginSlice.actions.setUser({}))
    dispatch(todoListSlice.actions.setTaskMap({}))
};


export const signIn = (credentials: Credentials) => (dispatch: Dispatch<any>) => {
    const signInUrl = LOGIN_BASE_URL + "/signin";
    axios.post(signInUrl, credentials).then((response: AxiosResponse<User>) => {
        dispatch(onSuccessfulSignIn(response))
    }).catch(error => {
        dispatch(setServerSideErrorMessage(error.response.data.message));
    })
};

const onSuccessfulSignIn = (response: AxiosResponse<User>) => (dispatch: Dispatch) => {
    const userData: User = response.data;
    localStorage.setItem("user", JSON.stringify(userData));
    dispatch(setUser(userData))
    dispatch(setServerSideErrorMessage(""));
}

export const signUp = (credentials: Credentials) => (dispatch: Dispatch<any>) => {
    const signInUrl = LOGIN_BASE_URL + "/signup";
    axios.post(signInUrl, credentials).then(() => {
        dispatch(signIn(credentials));
        dispatch(loginSlice.actions.setServerSideErrorMessage(""));
    }).catch(() => {
        dispatch(setServerSideErrorMessage("failed to signUp"));
    })
};


export const selectUser = (state: FullState) => state.login.user;
export const selectServerSideErrorMessage = (state: FullState) => state.login.serverSideErrorMessage;

export default loginSlice.reducer;
