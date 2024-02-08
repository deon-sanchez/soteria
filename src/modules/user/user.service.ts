import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { UserResponse, UserInput, UserDocument } from './user.entity';

const SALT_ROUNDS = 10;

/**
 * Service class for managing user-related operations.
 */
@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserResponse.name) private userModel: Model<UserDocument>,
  ) {}

  /**
   * Creates a new user.
   * @param user - The user input data.
   * @returns A promise that resolves to the created user.
   * @throws {InternalServerErrorException} If user creation fails.
   */
  async createUser(user: UserInput): Promise<UserResponse> {
    try {
      user.password = await bcrypt.hash(user.password, SALT_ROUNDS);
      const newUser = new this.userModel(user);
      return newUser.save();
    } catch (error) {
      throw new InternalServerErrorException('User creation failed');
    }
  }

  /**
   * Retrieves all users.
   * @returns A promise that resolves to an array of users.
   * @throws {Error} If an error occurs while retrieving users.
   */
  async getAllUsers(): Promise<UserResponse[]> {
    try {
      const users = await this.userModel.find().exec();
      return users;
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * Retrieves a user by email.
   * @param email - The email of the user to retrieve.
   * @returns A promise that resolves to the retrieved user.
   * @throws {NotFoundException} If the user with the specified email is not found.
   */
  async getUserByEmail(email: string): Promise<UserResponse> {
    try {
      const user = await this.userModel.findOne({ email }).exec();
      return user;
    } catch (error) {
      throw new NotFoundException(`User ${email} not found`);
    }
  }

  /**
   * Deletes a user by email.
   * @param email - The email of the user to delete.
   * @returns A promise that resolves to the deleted user.
   * @throws {InternalServerErrorException} If user deletion fails.
   */
  async deleteUserByEmail(email: string): Promise<UserResponse> {
    try {
      const user = await this.userModel.findOneAndDelete({ email }).exec();
      return user;
    } catch (error) {
      throw new InternalServerErrorException('User deletion failed');
    }
  }
}
