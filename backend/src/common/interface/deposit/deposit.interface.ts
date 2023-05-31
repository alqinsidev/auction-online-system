import { Timestamp } from 'typeorm';

export interface StoreDepositResponse {
  id: string;
  updated_at: Timestamp;
  updated_deposit: number;
  store_amount: number;
}
