import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AddUserDto } from './dto/add-user.dto';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UserService {

    constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

    add(addUserDto: AddUserDto): Promise<UserDocument> {
      const addedUser = new this.userModel(addUserDto);
      return addedUser.save();
    }
  
    async findAll(): Promise<User[]> {
      return this.userModel.find().exec();
    }

    async findOne(username: string, password: string): Promise<User> {
        return this.userModel.findOne({username, password}).exec();
      }
}
