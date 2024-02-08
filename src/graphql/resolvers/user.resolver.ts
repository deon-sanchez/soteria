import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { UserService } from '../../modules/user/user.service';
import { UserResponse, UserInput } from '../../modules/user/user.entity';
import { Public } from 'src/common/decorator/public.decorator';

@Resolver((of) => UserResponse)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query((returns) => [UserResponse])
  getUsers(): Promise<UserResponse[]> {
    return this.userService.getAllUsers();
  }

  @Query((returns) => UserResponse)
  async getUser(@Args('email') email: string): Promise<UserResponse> {
    return this.userService.getUserByEmail(email);
  }

  @Public()
  @Mutation((returns) => UserResponse)
  async createUser(@Args('input') input: UserInput): Promise<UserResponse> {
    return this.userService.createUser(input);
  }

  @Mutation((returns) => UserResponse)
  async deleteUser(@Args('email') email: string): Promise<UserResponse> {
    return this.userService.deleteUserByEmail(email);
  }
}
