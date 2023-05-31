import { Timestamp } from 'typeorm';

export interface CreateBidResponse {
  item_id: string;
  user_id: string;
  last_price: number;
  start_date: string;
  end_date: string;
  isCompleted: boolean;
  id: string;
  created_at: string | Timestamp;
  updated_at: string | Timestamp;
}

export interface AuctionItem {
  id: string;
  name: string;
  start_price: number;
  last_price: number;
  start_date: string;
  end_date: string;
  isDraft: boolean;
  isCompleted: boolean;
  created_at: string;
  updated_at: string;
  user?: {
    id: string;
    full_name: string;
  };
  winner?: {
    id: string;
    full_name: string;
  };
}
