export interface StoreDepositPayload {
  store_amount: number;
}

export interface StoreDepositResponse {
  id: string;
  user_id: string;
  updated_deposit: number;
  store_amount: number;
  updated_at: string;
}

export interface GetMyDepositResponse {
  id: string;
  user_id: string;
  amount: number;
  updated_at: string;
}

export interface DepositHistory {
  id: string;
  user_id: string;
  amount: number;
  isReturn: boolean;
  created_at: string;
}
