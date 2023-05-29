
import { CreateBidItemPayload, CreateItemResponse } from "../common/interface/bid.interface";
import { ResponseMessage } from "../common/interface/response.interface";
import { client } from "../utils/httpClient.utils";

const ItemServices = {
  createItem: async (
    payload: CreateBidItemPayload
  ): Promise<ResponseMessage<CreateItemResponse>> => {
    return (await client.post('/bid',payload)).data
  },
};

export default ItemServices