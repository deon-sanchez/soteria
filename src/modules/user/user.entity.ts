import { Field, HideField, InputType, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type UserDocument = UserResponse & Document;

@InputType({ description: 'User Input' })
export class UserInput {
  @Field()
  email: string;

  @Field()
  password: string;
}

@ObjectType({ description: 'User Response' })
@Schema()
export class UserResponse {
  @Field((type) => String)
  @Prop({ type: mongoose.Schema.Types.ObjectId, auto: true })
  _id: string;

  @Field((type) => String)
  @Prop({ type: String, required: true, unique: true })
  email: string;

  @HideField()
  @Prop({ type: String, required: true })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(UserResponse);
