import moment from 'moment'
import {User} from "../login/loginIntefaces";

export interface TodoState {
    taskMap: TaskMap,
    todoItemIdUnderEdit: string
}

export interface TaskItem {
    title: string,
    date: string,
    modified: string,
    done: boolean,
    id?: string
}

export interface ResponseTaskItem extends TaskItem{
    id: string
}



export interface TaskMap {
    [id: string]: TaskItem
}

export interface NewTask {
    title: string,
    done: boolean
}