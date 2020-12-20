import { Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import { Document, Schema as Sch, ObjectId } from 'mongoose';

export type ImageDocument = Image & Document;

@Schema()
export class Image {

  @Prop()
  filename: string;

  @Prop()
  fileExt: string;

  @Prop()
  path: string;

  @Prop({ type: Sch.Types.ObjectId, ref: 'User' })
  userId: ObjectId;
}

export class ImageRef {
  @Prop()
  filename: string;

  @Prop()
  fileExt: string;

  @Prop()
  path: string;

  @Prop({ type: Sch.Types.ObjectId, ref: 'Image' })
  _id;
}

export const ImageSchema = SchemaFactory.createForClass(Image);
