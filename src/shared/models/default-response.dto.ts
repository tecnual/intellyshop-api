import { ErrorResponse } from './error-response.dto';

export interface IDefaultResponse<T> {
  data: T;
  errors: ErrorResponse[];
}

export class DefaultResponse<T> implements IDefaultResponse<T> {
  data: T;
  errors: ErrorResponse[];

  constructor(data: T, errors?: ErrorResponse[]) {
    this.data = data;
    this.errors = errors || null;
  }
}
