import { ErrorResponse } from "./error-response.interface";

export interface DefaultResponse<T> {
  data: T,
  errors: ErrorResponse[]
}
