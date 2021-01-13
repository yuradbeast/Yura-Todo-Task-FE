import {createSlice, PayloadAction, Slice} from '@reduxjs/toolkit';
import {Credentials, LoginState, User} from "./loginIntefaces";

import axios, {AxiosResponse} from 'axios';
import {Dispatch} from 'redux';
import {FullState} from "../../app/store";
import {todoListSlice} from "../todo/todoListSlice";

const loginBaseURL = "http://localhost:8080/api/v1/auth";

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
    const signInUrl = loginBaseURL + "/signin";
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
    const signInUrl = loginBaseURL + "/signup";
    axios.post(signInUrl, credentials).then(() => {
        dispatch(signIn(credentials));
        dispatch(loginSlice.actions.setServerSideErrorMessage(""));
    }).catch(error => {
        dispatch(setServerSideErrorMessage("failed to signUp"));

        // const data = error.response.data;
        // todo:yuri i only get 1 message from server because of time limitation
        // dispatch(loginSlice.actions.setServerSideErrorMessage(data.errors && data.errors[0].field + ": " + data.errors[0].defaultMessage));
    })
};


export const selectUser = (state: FullState) => state.login.user;
export const selectServerSideErrorMessage = (state: FullState) => state.login.serverSideErrorMessage;

export default loginSlice.reducer;
