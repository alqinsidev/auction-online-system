export interface CreateBidItemPayload {
  name: string;
  description: string;
  start_price: number;
  time_window: number;
}

export interface CreateItemResponse {
  name: string;
  description: string;
  user_id: string;
  start_price: number;
  last_price: number;
  time_window: number;
  start_date: string;
  end_date: string;
  isDraft: boolean,
  isCompleted: boolean;
  id: string;
  created_at: string;
  updated_at: string;
}

export interface PublishBidItemPayload {
  bid_id: string;
}

export interface MakeBidPayload {
  bid_id: string;
  bid_amount: number;
}

interface User {
  id: string;
  full_name: string;
}

export interface BidResponse {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  start_price: number;
  last_price: number;
  isDraft: boolean;
  isCompleted: boolean;
  created_at: string;
  updated_at: string;
  user: User;
}
