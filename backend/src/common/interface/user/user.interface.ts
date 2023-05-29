interface UserData {
  id: string;
  full_name: string;
  email: string;
  deposit?: {
    id: string;
    amount: number;
  }
}

export { UserData };
