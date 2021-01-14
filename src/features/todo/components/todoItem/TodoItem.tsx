import React, {useState} from 'react';
import {TaskItem} from "../../todoInterfaces";
import moment from "moment-timezone";
import {useDispatch} from "react-redux";
import {deleteTask, updateTask} from "../../todoListSlice";
import * as _ from 'lodash';
import styles from './todoItem.module.css';
import {Button, Card, Checkbox, ControlGroup, Popover,} from '@blueprintjs/core';


export interface TodoItemProps {
    taskItem: TaskItem;
    classname?: string;
}

export const TodoItem = (props: TodoItemProps) => {

    const taskItem = props.taskItem;
    const dispatch = useDispatch();
    const [editObject, setEditObject] = useState<TaskItem>(taskItem);


    const handleUpdate = (field, value) => {
        const copyOfEditObj: TaskItem = {...taskItem};
        copyOfEditObj[field] = value;
        copyOfEditObj.modified = moment().utcOffset(0).format();
        dispatch(updateTask(copyOfEditObj))
    }

    const handleTextEdit = (text) => {
        const copyOfEditObject = {...editObject, "title": text};
        setEditObject(copyOfEditObject);
    }

    const getTimeDisplayFormat = (time: string) => {
        return moment(time).tz(moment.tz.guess()).format("HH:mm DD/MM/yyyy")
    };

    const submitDisabled: boolean = (_.isEqual(editObject.title, taskItem.title));

    const getMetadataContent = (): JSX.Element => {
        return (
            <div className="d-flex ml-5 mt-2">
                <div className="text-muted mr-3"> Created : {getTimeDisplayFormat(taskItem.date)} </div>
                <div className="text-muted"> Last Modified : {getTimeDisplayFormat(taskItem.modified)} </div>
            </div>
        );
    }

    return (<Card style={taskItem.done ? {backgroundColor: "#E1E8ED"} : {}}>
            <div className={styles.todoTaskRow}>
                <div className={styles.todoTaskCheckbox}>

                    <Popover interactionKind="hover" content="Is task complete">
                        <Checkbox label={"Done"} inline onChange={() => handleUpdate("done", !taskItem.done)}/>
                    </Popover>
                </div>


                <form className={styles.todoTaskControls}
                      onSubmit={(e) => {
                          handleUpdate("title", editObject.title);
                          e.preventDefault();
                      }}>
                    <ControlGroup fill vertical={false}>
                        <input
                            placeholder="Enter task title..."
                            className="bp3-input"
                            type="text"
                            value={editObject.title}
                            onChange={(e) => handleTextEdit(e.target.value)}/>
                        {
                            !submitDisabled &&
                            <Button title={"Save"} small intent="success" disabled={submitDisabled} icon="upload"
                                    type="submit"/>
                        }
                        <Button title={"Delete"} small intent="danger" icon="delete"
                                onClick={() => dispatch(deleteTask(taskItem.id || ""))}/>
                    </ControlGroup>
                </form>
            </div>
            {getMetadataContent()}
        </Card>
    );
}
