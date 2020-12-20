import { Document } from 'mongoose';
import { ImageRef } from 'src/Image/image.schema';
export declare type UserDocument = User & Document;
export declare class User {
    username: string;
    name: string;
    password?: string;
    email?: string;
    avatar?: ImageRef;
}
export declare const UserSchema: import("mongoose").Schema<any>;
