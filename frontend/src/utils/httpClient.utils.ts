import axios from "axios";
import { store } from "../redux/Store";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_ENDPOINT,
});

client.interceptors.request.use((config)=>{
  const accessToken = store.getState().auth.accessToken
  config.headers.Authorization = `Bearer ${accessToken}`
  return config
})
export { client };
