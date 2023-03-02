export interface User {
    displayName: string;
    token: string;
    userName: string;
    image?: string;
}

export interface UserFormValues {
    email: string;
    password: string;
    displayName?: string;
    userName?: string;
}