import { Document, Schema as Sch, ObjectId } from 'mongoose';
export declare type ImageDocument = Image & Document;
export declare class Image {
    filename: string;
    fileExt: string;
    path: string;
    userId: ObjectId;
}
export declare class ImageRef {
    filename: string;
    fileExt: string;
    path: string;
    _id: any;
}
export declare const ImageSchema: Sch<any>;
