import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {selectUser, signOut} from "../../login/loginSlice";
import {deleteAllTasks, fetchAllTasks, selectTaskMap} from "../todoListSlice";
import * as _ from 'lodash'
import {CreateNewTask} from "./createNewTask/CreateNewTask";
import {TaskItem, TaskMap} from "../todoInterfaces";
import {TodoItem} from "./todoItem/TodoItem";
import {User} from "../../login/loginIntefaces";
import styles from './todoList.module.css'

import {Button, Menu, MenuItem, Popover, Position, Radio, RadioGroup} from "@blueprintjs/core";


type Orders = "asc" | "desc";

const prettySortNames = {
    date: "Creation Date",
    modified: "Modification Date"
}

type OrderBy = {
    field: OrderField,
    order: Order
}

type OrderField = "date" | "modify"

type Order = "asc" | "desc";

export const TodoList = (props) => {


    const dispatch = useDispatch();
    const taskMap: TaskMap = useSelector(selectTaskMap)
    const user: User = useSelector(selectUser)
    const [orderBy, setOrderBy] = useState<OrderBy>({field: 'date', order: "desc"});
    const [isCreatingNewTask, setIsCreatingNewTask] = useState(false);


    useEffect(() => {
        if (!_.isEmpty(user)) {
            dispatch(fetchAllTasks());
        }
    }, [user])

    useEffect(() => {
        setIsCreatingNewTask(false);
    }, [taskMap])

    const handleSignOut = () => {
        dispatch(signOut());
    }

    const handleDeleteAll = () => {
        dispatch(deleteAllTasks());
    }

    const getSortedTodoList = (field: OrderField, order: Orders): TaskItem[] => {
        return _.orderBy(taskMap, [field], [order]);
    }


    const getSortDropDown = () => {
        const handleOrderChange = (key, value) => {
            const copyOfOrderBy = {...orderBy, [key]: value}
            setOrderBy(copyOfOrderBy);
        }

        return <div className={styles.sortDropDownContainer}>
            <Popover content={
                <Menu>
                    <MenuItem onClick={() => handleOrderChange("field", "modified")} text={prettySortNames.modified}/>
                    <MenuItem onClick={() => handleOrderChange("field", "date")} text={prettySortNames.date}/>
                </Menu>
            }
                     position={Position.RIGHT_TOP}>
                <Button className={styles.sortByFieldButton} icon="share"
                        text={"Sorting by " + prettySortNames[orderBy.field]}/>
            </Popover>

            <RadioGroup
                className="m-2 ml-3"
                inline={true}
                onChange={(e: any) => handleOrderChange("order", e.target.value)}
                selectedValue={orderBy.order}
            >
                <Radio label="Desc" value="desc"/>
                <Radio className={styles.marginRight7} label="Asc" value="asc"/>
            </RadioGroup>

        </div>
    }


    const getNavBar = () => {
        return <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">

                <Button icon="log-out" intent="none" onClick={() => handleSignOut()} className="btn-sm  m-3">Sign Out</Button>
                <Button intent="success" onClick={() => setIsCreatingNewTask(!isCreatingNewTask)}
                        className="  m-3">Create New Task
                </Button>
                <Button intent="danger" onClick={() => handleDeleteAll()} className=" m-3">Delete All Tasks
                </Button>
                {getSortDropDown()}
            </div>
        </nav>
    }

    return (
        <div className="bg-light">
            {getNavBar()}
            <CreateNewTask isOpen={isCreatingNewTask}/>
            <h1>Tasks</h1>
            {
                _.map(getSortedTodoList(orderBy.field, orderBy.order), task => {
                    return <TodoItem classname="mt-4" key={task.id} taskItem={task}/>
                })
            }
        </div>
    );
}



