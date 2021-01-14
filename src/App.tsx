import './App.css';
import React, {useEffect} from 'react';

import "bootstrap/dist/css/bootstrap.min.css";
import {Login} from "./features/login/components/Login";
import {Route, Switch} from "react-router-dom";
import {history} from './helpers/history';
import {TodoList} from "./features/todo/components/TodoList";
import {useSelector} from "react-redux";
import {selectUser} from "./features/login/loginSlice";
import {User} from "./features/login/loginIntefaces";


export const BASE_UI_URL = "http://" + window.location.host;
export const BASE_BACKEND_URL = "http://localhost:8080";
export const LOGIN_BASE_URL = BASE_BACKEND_URL + "/api/v1/auth";
export const TODO_BASE_URL = BASE_BACKEND_URL + "/api/v1/todoTasks";



const App = props => {

    const user: User = useSelector(selectUser);

    useEffect(() => {
        if (user.accessToken) {
            const urlHome = new URL(BASE_UI_URL + "/todolist");
            history.push(urlHome.pathname)
        } else {
            const urlLogin = new URL(BASE_UI_URL + "/login");
            history.push(urlLogin.pathname)
        }

    }, [user])


    return (
        <div className="App">
            <div className="container-fluid w-50">
                <Switch>
                    <Route user={user} exact path={["/", "/todolist"]} component={TodoList}/>
                    <Route exact path="/login" component={Login}/>
                </Switch>
            </div>
        </div>

    );
}

export default App;
