import { Controller, Post, Request } from '@nestjs/common';
import { User, UserDocument } from './user.schema';
import { UserService } from './user.service';

@Controller('user')
export class UserController {

    constructor( private readonly userService: UserService) {}

    @Post()
    async addUser(@Request() req): Promise<any> {
        const user: UserDocument =  await this.userService.add(req.body);

        console.log('dbres', user);
        return { _id: user._id, username: user.username, email: user.email};
    }

    
}
