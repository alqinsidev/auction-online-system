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
