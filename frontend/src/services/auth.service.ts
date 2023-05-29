import {
  AuthPayload,
  AuthResponse,
  NewUserPayload,
  RegisterResponse,
} from "../common/interface/auth.interface";
import { ResponseMessage } from "../common/interface/response.interface";
import { setAuth } from "../redux/Slice/AuthSlice";
import { store } from "../redux/Store";
import { client } from "../utils/httpClient.utils";

const AuthServices = {
  signIn: async (
    payload: AuthPayload
  ): Promise<ResponseMessage<AuthResponse>> => {
    const res = await client.post("/auth/login", payload);
    const { data } = res.data;
    const newAuthState = {
      isLoggedIn: true,
      user: data.userData,
      accessToken: data.accessToken,
    };
    store.dispatch(setAuth(newAuthState));
    return res.data;
  },
  register: async (
    payload: NewUserPayload
  ): Promise<ResponseMessage<RegisterResponse>> => {
    return (await client.post("/users", payload)).data;
  },
};

export default AuthServices;
