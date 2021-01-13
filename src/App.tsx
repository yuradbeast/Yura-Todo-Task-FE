import './App.css';
import React, {useEffect} from 'react';

import "bootstrap/dist/css/bootstrap.min.css";
import {Login} from "./features/login/Login";
import {Router, Switch, Route} from "react-router-dom";
import {history} from './helpers/history';
import {TodoList} from "./features/todo/components/TodoList";
import {Provider, useSelector} from "react-redux";
import {selectUser} from "./features/login/loginSlice";
import {User} from "./features/login/loginIntefaces";
import store from "./app/store";


type AppInternalType = React.FC<any>;


const App: AppInternalType = props => {

    const user: User = useSelector(selectUser);


    useEffect(() => {
        if (user.accessToken) {
            const urlHome = new URL("http://localhost:3000/todolist");
            history.push(urlHome.pathname)
        } else {
            const urlLogin = new URL("http://localhost:3000/login");

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
