import React, {useState} from 'react';
import {TaskItem} from "../todoInterfaces";
import moment from "moment-timezone";
import {useDispatch} from "react-redux";
import {deleteTask, updateTask} from "../todoListSlice";

export interface TodoItemProps {
    taskItem: TaskItem;
    classname?: string;
}

export const TodoItem = (props: TodoItemProps) => {
    const taskItem = props.taskItem;

    // const count = useSelector(selectCount);
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


    return (
        <div className={"card text-center " + props.classname} style={{backgroundColor: 'ButtonHighlight'}}>
            <div className="card-body ">
                    <textarea value={taskItem.title}
                              onChange={(e) => handleTextEdit(e.target.value)}
                              className="form-control mb-2"
                              id="exampleFormControlTextarea1"
                              rows={3}/>
            </div>

            <div className="" style={{display: "flex", justifyContent: "space-between", height: '50px'}}>

                <div style={{margin: '-14px 0 0 13px'}}>
                    <input
                        checked={taskItem.done}
                        onChange={() => handleUpdate("done", !taskItem.done)}
                        type={"checkbox"}
                        className="m-1"
                        id="exampleCheck1"/>
                    <label className="form-check-label" htmlFor="exampleCheck1">Done</label>
                </div>
                <button onClick={() => dispatch(deleteTask(taskItem.id || ""))} className="btn-sm btn-danger m-2">
                    Delete
                </button>
            </div>
            <div className="card-footer text-muted">
                Last Modified : {getTimeDisplayFormat(taskItem.modified)}
            </div>
            <div className="card-footer text-muted">
                Created : {getTimeDisplayFormat(taskItem.date)}
            </div>
        </div>
    );
}
