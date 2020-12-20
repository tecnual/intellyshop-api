import { Model } from 'mongoose';
import { AddUserDto } from './dto/add-user.dto';
import { User, UserDocument } from './user.schema';
export declare class UserService {
    private readonly userModel;
    constructor(userModel: Model<UserDocument>);
    add(addUserDto: AddUserDto): Promise<UserDocument>;
    findAll(filter: string): Promise<User[]>;
    findOne(username: string, password: string): Promise<User>;
}
