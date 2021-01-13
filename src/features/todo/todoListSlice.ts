import {createSlice} from '@reduxjs/toolkit';
import {Credentials, User} from "../login/loginIntefaces";
import {Dispatch} from "redux";
import axios, {AxiosResponse} from "axios";
import {setServerSideErrorMessage} from "../login/loginSlice";
import authHeader from "../../helpers/authHeader";
import {ResponseTaskItem, TaskItem, TaskMap} from "./todoInterfaces";
import {FullState} from "../../app/store";
import * as _ from 'lodash';

export const todoListSlice = createSlice({
    name: 'counter',
    initialState: {
        taskMap: {}
    },
    reducers: {
        setTaskMap: (state, action) => {
            console.log(action.payload)
            state.taskMap = action.payload
        }
    },
});

export const {setTaskMap} = todoListSlice.actions;

const todoTasksBaseURL = "http://localhost:8080/api/v1/todoTasks";


export const fetchAllTasks = () => (dispatch: Dispatch<any>) => {
    const url = todoTasksBaseURL + "/allTasks";
    axios.get(url, {headers: authHeader()})
        .then((response: AxiosResponse<TaskMap>) => {
            const taskMap: TaskMap = response.data;
            dispatch(setTaskMap(taskMap))
        }).catch(error => {
        console.error("Error: " + error);
        alert("Failed to fetch data");
    })
};

export const createTask = (task: TaskItem) => (dispatch: Dispatch<any>, getState: () => FullState) => {
    const url = todoTasksBaseURL + "/createTask";
    axios.post(url, task, {headers: authHeader()})
        .then((response: AxiosResponse<ResponseTaskItem>) => {
            const newTaskItem: ResponseTaskItem = response.data;
            const copyOfTodoMap = {[newTaskItem.id]: newTaskItem, ...getState().todo.taskMap,};
            dispatch(setTaskMap(copyOfTodoMap));
        }).catch(error => {
        console.error("Error: " + error);
        alert("Failed to create task");
    })
};

export const updateTask = (task: TaskItem) => (dispatch: Dispatch<any>, getState: () => FullState) => {
    const url = todoTasksBaseURL + "/updateTask";
    axios.post(url, task, {headers: authHeader()})
        .then((response: AxiosResponse<ResponseTaskItem>) => {
            const newTask: ResponseTaskItem = response.data;
            const copyOfTodoMap = {...getState().todo.taskMap, [newTask.id]: response.data};
            dispatch(setTaskMap(copyOfTodoMap))
        }).catch(error => {
        console.error("Error: " + error);
        alert("Failed to update task");
    })
};

export const deleteTask = (taskId: string) => (dispatch: Dispatch<any>, getState: () => FullState) => {
    const url = todoTasksBaseURL + "/deleteTask?taskId=" + taskId;
    axios.delete(url, {headers: authHeader()})
        .then(() => {
            const copyOfTodoMap = {...getState().todo.taskMap};
            delete copyOfTodoMap[taskId]
            dispatch(setTaskMap(copyOfTodoMap))
        }).catch(error => {
        console.error("Error: " + error);
        alert("Failed to delete task");
    })
};

export const deleteAllTasks = () => (dispatch: Dispatch<any>) => {
    const url = todoTasksBaseURL + "/deleteAllTasks";
    axios.delete(url, {headers: authHeader()})
        .then(() => {
            dispatch(setTaskMap({}))
        }).catch(error => {
        console.error("Error: " + error);
        alert("Failed to delete task");
    })
};

export const selectTaskMap = (state: FullState) => state.todo.taskMap;

export default todoListSlice.reducer;
