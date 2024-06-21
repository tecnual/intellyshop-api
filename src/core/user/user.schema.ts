import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ImageRef } from 'src/Image/image.schema';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop()
  _id?: Types.ObjectId;

  @Prop({ type: String, required: true, unique: true })
  username: string;

  @Prop({ type: String })
  name: string;

  @Prop({ type: String, select: false })
  password?: string;

  @Prop({ type: String, required: true, unique: true })
  email?: string;

  @Prop()
  avatar?: ImageRef;

  @Prop({ type: Boolean, required: true, default: false })
  confirmed: boolean;

  @Prop({ type: String, default: 'es' })
  lang?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ '$**': 'text' });
