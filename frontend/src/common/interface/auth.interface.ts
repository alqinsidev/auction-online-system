export interface AuthPayload {
    email: string,
    password: string,
}

export interface NewUserPayload {
    full_name: string,
    email: string,
    password: string,
}

interface UserData {
    id: string;
    fullname: string;
    email: string;
}

export interface LoginResponse {
    accessToken: string;
    userData: UserData;
}

export interface RegisterResponse {
    email: string;
    password: string;
    full_name: string;
    id: string;
    created_at: string;
}