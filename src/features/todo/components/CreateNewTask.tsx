import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import styles from './todoList.module.css';
import {NewTask, TaskItem} from "../todoInterfaces";
import moment from 'moment-timezone'
import {createTask} from "../todoListSlice";
import * as _ from 'lodash';


type CreateNewTaskProps = { isOpen: boolean, classname?: string }

export const CreateNewTask = (props: CreateNewTaskProps) => {
    // const count = useSelector(sele);
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
        if (!_.isEmpty(newTaskFields.title)) return;
        const currentDate = moment().utcOffset(0).format();
        // date: moment(new Date()).tz(moment.tz.guess()).format()
        const objectToSubmit: TaskItem = {
            title: newTaskFields.title,
            done: newTaskFields.done,
            date: currentDate,
            modified: currentDate
        };
        dispatch(createTask(objectToSubmit));
    }

    return props.isOpen ?
        <div className={"container-fluid card mb-3 " + props.classname} style={{backgroundColor: 'lightblue'}}>
            <div style={{display: "flex", flexDirection: 'column'}}>
                <div className="form">
                    <label htmlFor="form-label" className="form-label fw-bold">Create Task</label>
                    <textarea value={newTaskFields.title}
                              onChange={e => handleNewTaskFieldsInputs("title", e.target.value)}
                              className="form-control" id="title"/>

                </div>
                <div className="" style={{display: "flex", justifyContent: "start", marginTop: '7px'}}>
                    <input
                        checked={newTaskFields.done}
                        onChange={e => handleNewTaskFieldsInputs("done", !newTaskFields.done)}
                        type={"checkbox"}
                        className="m-1"
                        id="exampleCheck1"/>
                    <label className="form-check-label" htmlFor="exampleCheck1">Done</label>
                </div>
            </div>
            <div className={styles.signInUpContainer}>
                <button onClick={() => handleSubmit()} className="btn-sm btn-primary m-3">Submit</button>
            </div>
        </div>
        :
        <div/>
}
