export interface LoginState {
        user: User,
        serverSideErrorMessage: string
}

export interface User {
    id: string,
    username: string,
    roles: string[],
    accessToken: string,
    tokenType: string
}

export interface Credentials {
    username: string,
    password: string
}