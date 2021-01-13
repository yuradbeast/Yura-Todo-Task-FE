import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {selectUser, signOut} from "../../login/loginSlice";
import {deleteAllTasks, fetchAllTasks, selectTaskMap} from "../todoListSlice";
import * as _ from 'lodash'
import {CreateNewTask} from "./CreateNewTask";
import {TaskItem, TaskMap} from "../todoInterfaces";
import {TodoItem} from "./TodoItem";
import {User} from "../../login/loginIntefaces";
import {LodashOrderBy} from "lodash/fp";


type Orders = "asc" | "desc";
type Field = "date" | "desc";

export const TodoList = (props) => {

    const dispatch = useDispatch();
    const taskMap: TaskMap = useSelector(selectTaskMap)
    const user: User = useSelector(selectUser)
    const [orderBy, setOrderBy] = useState({field: 'date',});
    const [isCreatingNewTask, setIsCreatingNewTask] = useState(false);


    useEffect(() => {
        if (!_.isEmpty(user)) {
            dispatch(fetchAllTasks());
        }
    }, [props.user])

    const handleSignOut = () => {
        dispatch(signOut());
    }

    const handleDeleteAll = () => {
        dispatch(deleteAllTasks());
    }

    const getSortedTodoList = (field: Field, order: Orders): TaskItem[] => {
        return _.orderBy(taskMap, [field], [order]);
    }

    return (
        <div>
            <button onClick={() => handleSignOut()} className="btn-sm btn-primary m-3">Sign Out</button>
            <button onClick={() => setIsCreatingNewTask(!isCreatingNewTask)} className="btn-sm btn-success m-3">Create New Task</button>
            <button onClick={() => handleDeleteAll()} className="btn-sm btn-danger m-3">Delete All Tasks</button>

                <CreateNewTask isOpen={isCreatingNewTask}/>
                {
                    _.map(getSortedTodoList("date", "desc"), task => {
                        return <TodoItem classname="mt-4" key={task.id} taskItem={task}/>
                    })
                }
        </div>
);
}
