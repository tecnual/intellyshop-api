import { User } from './user.schema';
import { UserService } from './user.service';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    addUser(req: any): Promise<any>;
    usersList(filter: any): Promise<User[]>;
}
