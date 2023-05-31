import { UserData } from '../user/user.interface';

export interface LoginResponse {
  accessToken: string;
  userData: UserData;
}

export interface AuthPayload {
  id: string;
  fullname: string;
  email: string;
}
