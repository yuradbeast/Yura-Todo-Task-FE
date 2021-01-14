import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import styles from './login.module.css';
import {selectServerSideErrorMessage, signIn, signUp} from "../loginSlice";
import {Credentials} from "../loginIntefaces";
import * as _ from "lodash";
import classNames from 'classnames'


type InputErrors = {
    username: string[],
    password: string[]
}


export const Login = () => {
    const serverSideErrorMessage = useSelector(selectServerSideErrorMessage);
    const dispatch = useDispatch();
    const [credentials, setCredentials] = useState<Credentials>({username: "", password: ""});
    const [inputErrors, setInputsErrors] = useState<InputErrors>({username: [], password: []});


    const handleSignIn = () => {
        dispatch(signIn(credentials))

    }


    const getUsernameInputErrors = (username): string[] => {
        const errors: string[] = [];
        if (username.length < 4 || username.length > 13) {
            errors.push("Username must be at between 4 and 12 characters");
        }
        if (username.search(/^[a-zA-Z0-9]*$/) < 0) {
            errors.push("Username must start with english latter and can only contain numbers and letters");
        }
        return errors;
    }


    const getPasswordInputErrors = (password): string[] => {
        const errors: string[] = [];
        if (password.length < 4) {
            errors.push("Your password must be at least 6 characters");
        }
        if (password.search(/[a-z]/i) < 0) {
            errors.push("Your password must contain at least one letter.");
        }
        if (password.search(/[0-9]/) < 0) {
            errors.push("Your password must contain at least one digit.");
        }
        return errors;
    }

    const validateCredentials = (): boolean => {
        const passwordInputErrors = getPasswordInputErrors(credentials.password);
        const usernameInputErrors = getUsernameInputErrors(credentials.username);

        const newErrorsObject: InputErrors = {
            password: passwordInputErrors,
            username: usernameInputErrors
        }
        setInputsErrors(newErrorsObject);
        return _.isEmpty(passwordInputErrors) && _.isEmpty(usernameInputErrors);
    }

    const handleSignUp = () => {
        if (validateCredentials()) {
            dispatch(signUp(credentials))
        }
    }


    const handleCredentialsInput = (fieldName: string, input: string) => {
        if (input.includes(" ")) {
            return;
        }
        const copyOfCredentials: Credentials = {...credentials};
        copyOfCredentials[fieldName] = input;
        setCredentials(copyOfCredentials)
    }

    const getErrorElementsByField = (field) => {
        return _.map(inputErrors[field], (error, index) => {
                const id = "error_element_" + field + "_" + index;
                return getErrorElement(error, id);
            }
        )
    }

    const getErrorElement = (error, id: string) => {
        return <div id={id} key={id} className={styles.errorMessage}>
            {error}
        </div>
    }

    return (
        <div className={classNames("container-fluid card p-3" , styles.loginContainer)}>
            <div>
                <div>
                    <label>Username</label>
                    <input value={credentials.username}
                           onChange={e => handleCredentialsInput("username", e.target.value)} type="text"
                           className="form-control" id="userNameField"/>
                    {!_.isEmpty(inputErrors.username) && getErrorElementsByField("username")}
                </div>
                <div>
                    <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                    <input value={credentials.password}
                           onChange={e => handleCredentialsInput("password", e.target.value)} type="password"
                           className="form-control" id="exampleInputPassword1"/>
                    {!_.isEmpty(inputErrors.password) && getErrorElementsByField("password")}
                </div>
                {getErrorElement(serverSideErrorMessage, "serverSideError")}
            </div>
            <div className={styles.signInUpContainer}>
                <button onClick={() => handleSignIn()} className="btn-sm btn-primary m-3">Sign In</button>
                <button onClick={() => handleSignUp()} className="btn-sm btn-primary m-3">Sign Up</button>
            </div>
        </div>
    );
}
