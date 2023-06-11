import {
  BidResponse,
  CreateBidItemPayload,
  MakeBidPayload,
  PublishBidItemPayload,
} from "../common/interface/bid.interface";
import { ResponseMessage } from "../common/interface/response.interface";
import { client } from "../utils/httpClient.utils";

const BidServices = {
  createBidItem: async (
    payload: CreateBidItemPayload
  ): Promise<ResponseMessage<any>> => {
    return (await client.post("/bid", payload)).data;
  },
  publishBidItem: async (
    payload: PublishBidItemPayload
  ): Promise<ResponseMessage<any>> => {
    return (await client.put("/bid", payload)).data;
  },
  makeBid: async(
    payload: MakeBidPayload
  ): Promise<ResponseMessage<any>> => {
    return (await client.post('/bid/new',payload)).data
  },
  getBidList: async (
    isDraft = false
  ): Promise<ResponseMessage<BidResponse[]>> => {
    const url = isDraft ? "/bid?isDraft=true" : "/bid";
    return (await client.get(url)).data;
  },
  getAuctionList: async (
    status?: "ongoing" | "completed"
  ): Promise<ResponseMessage<any>> => {
    const url = status ? `/bid/auction?status=${status}` : "/bid/auction";
    return (await client.get(url)).data;
  },
  getBidHistory: async (bid_id: string): Promise<ResponseMessage<BidResponse>> => {
    return (await client.get(`/bid/history/${bid_id}`)).data
  }
};

export default BidServices;
