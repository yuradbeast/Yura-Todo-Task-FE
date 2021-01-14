import React, {useState} from 'react';
import {useDispatch} from 'react-redux';

import styles from './createNewTask.module.css';
import {NewTask, TaskItem} from "../../todoInterfaces";
import moment from 'moment-timezone'
import {createTask} from "../../todoListSlice";
import classNames from 'classnames'


type CreateNewTaskProps = {
    isOpen: boolean
}

export const CreateNewTask = (props: CreateNewTaskProps) => {
    const dispatch = useDispatch();
    const [newTaskFields, setNewTaskFields] = useState<NewTask>({
        title: "",
        done: false
    });


    const handleNewTaskFieldsInputs = (fieldName: string, input: string | boolean) => {
        const copyOfNewTaskFields: NewTask = {...newTaskFields};
        copyOfNewTaskFields[fieldName] = input;
        setNewTaskFields(copyOfNewTaskFields)
    }

    const handleSubmit = () => {
        const currentDate = moment().utcOffset(0).format();
        const objectToSubmit: TaskItem = {
            title: newTaskFields.title,
            done: newTaskFields.done,
            date: currentDate,
            modified: currentDate
        };
        dispatch(createTask(objectToSubmit));
    }

    return props.isOpen ?
        <div className={classNames("container-fluid card mb-3 mt-3", styles.container)}>
            <div className={styles.textAreaContainer}>
                <div className="form">
                    <h4 className="form-label">Create Task</h4>
                    <textarea value={newTaskFields.title}
                              placeholder="Write your task here"
                              onChange={e => handleNewTaskFieldsInputs("title", e.target.value)}
                              className="form-control" id="title"/>

                </div>
                <div className={styles.doneCheckBox}>
                    <input
                        checked={newTaskFields.done}
                        onChange={() => handleNewTaskFieldsInputs("done", !newTaskFields.done)}
                        type={"checkbox"}
                        className="m-1"
                        id="exampleCheck1"/>
                    <label className="form-check-label" htmlFor="exampleCheck1">Done</label>
                </div>
            </div>
            <div>
                <button onClick={() => handleSubmit()} className="btn-sm btn-primary m-3">Submit</button>
            </div>
        </div> : <div/>;
}
