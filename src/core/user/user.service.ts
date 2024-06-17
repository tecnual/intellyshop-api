import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Query } from 'mongoose';
import { AddUserDto } from './dto/add-user.dto';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService
  ) { }

  add(addUserDto: AddUserDto): Promise<UserDocument> {
    const addedUser = new this.userModel(addUserDto);
    return addedUser.save();
  }

  async findAll(filter: string): Promise<User[]> {
    return this.userModel.find({ $text: { $search: filter } }).exec();
  }

  async findOne(username: string, password: string): Promise<User> {
    return this.userModel.findOne({ username, password }).exec();
  }

  /**
   * Generate confirm email token
   * @param email
   * @returns
   */
   public generateConfirmEmailToken(email: string) {
    return this.jwtService.sign({email});
  }

  /**
   * updateConfirm
   */
  public updateConfirm(query: any): Query<UserDocument, UserDocument>  {
    return this.userModel.findOneAndUpdate(query, {confirmed: true}, {new:true});
  }
}
