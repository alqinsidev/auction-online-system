import { UserData } from '../user/user.interface';

export interface AuthResponse {
  accessToken: string;
  userData: UserData;
}

export interface AuthPayload {
  id: string;
  fullname: string;
  email: string;
}
