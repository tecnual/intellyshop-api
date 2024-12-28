import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Types } from 'mongoose';
import { ImageRef } from 'src/Image/image.schema';
import { FireflySettings } from './dto/update-user.request.dto';

export type UserDocument = User & Document;

@Schema()
export class User {
  @ApiProperty({ type: () => Types.ObjectId, example: '90hd009dfsg098fg908sdf' })
  @Prop()
  _id?: Types.ObjectId;

  @ApiProperty({ description: 'Name used to identify user', type: String, example: 'Peter' })
  @Prop({ type: String, required: true, unique: true })
  username: string;

  @Prop({ type: String })
  name: string;

  @Prop({ type: String, select: false })
  password?: string;

  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop()
  avatar?: ImageRef;

  @Prop({ type: Boolean, required: true, default: false })
  confirmed: boolean;

  @Prop({ type: String, default: 'es' })
  lang?: string;

  @Prop()
  firefly: FireflySettings;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ '$**': 'text' });
