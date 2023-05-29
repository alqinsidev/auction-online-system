export interface ResponseMessage<T> {
    message?: string;
    data: T;
    status: number;
  }
  