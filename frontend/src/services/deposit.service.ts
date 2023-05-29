import {
  GetMyDepositResponse,
  StoreDepositPayload,
  StoreDepositResponse,
} from "../common/interface/deposit.interface";
import { ResponseMessage } from "../common/interface/response.interface";
import { setDeposit } from "../redux/Slice/AuthSlice";
import { store } from "../redux/Store";
import { client } from "../utils/httpClient.utils";

const DepositServices = {
  storeDeposit: async (
    payload: StoreDepositPayload
  ): Promise<ResponseMessage<StoreDepositResponse>> => {
    const res = await client.put("/deposit", payload);
    const { data } = res;
    store.dispatch(setDeposit(data.data.updated_deposit));
    return data;
  },
  getMyDeposit: async (): Promise<ResponseMessage<GetMyDepositResponse>> => {
    const res = await client.get("/deposit");
    const { data } = res;
    store.dispatch(setDeposit(data.data.amount));
    return data;
  },
};

export default DepositServices;
