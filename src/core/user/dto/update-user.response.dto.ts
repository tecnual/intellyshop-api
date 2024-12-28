import { IDefaultResponse } from 'src/shared/models/default-response.dto';
import { User } from '../user.schema';
import { ErrorResponse } from 'src/shared/models/error-response.dto';

export class UpdateUserResponse implements IDefaultResponse<User> {
  data: User;
  errors: ErrorResponse[];

  constructor(data: User, errors?: ErrorResponse[]) {
    this.data = data;
    this.errors = errors || null;
  }
}
