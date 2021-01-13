import {combineReducers, configureStore} from '@reduxjs/toolkit';
import {todoListSlice} from '../features/todo/todoListSlice';
import {loginSlice} from "../features/login/loginSlice";
import {LoginState, User} from "../features/login/loginIntefaces";
import {TodoState} from "../features/todo/todoInterfaces";


const reducer = {
    login: loginSlice.reducer,
    todo: todoListSlice.reducer
}

export interface FullState {
    login: LoginState,
    todo: TodoState
}


const getUserFromStorage = (): User => {
   return JSON.parse(localStorage.getItem("user") || "{}");
}

const preloadedState: Partial<FullState> = {
   login: {
    serverSideErrorMessage: "",
    user: getUserFromStorage()
   }
}


export default configureStore({
        reducer,
        preloadedState
});
