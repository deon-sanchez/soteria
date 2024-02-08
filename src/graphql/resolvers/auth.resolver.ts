import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { AuthService } from '../../auth/auth.service';
import {
  LoginResponse,
  AuthInput,
  LogoutResponse,
} from '../../auth/auth.entity';
import { Public } from 'src/common/decorator/public.decorator';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Mutation((returns) => LoginResponse)
  async login(
    @Args('input') input: AuthInput,
    @Context() { res },
  ): Promise<LoginResponse> {
    return await this.authService.loginUser(input, res);
  }

  @Public()
  @Mutation((returns) => LogoutResponse)
  async logout(@Context() { res }): Promise<LogoutResponse> {
    return await this.authService.logoutUser(res);
  }
}
