import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { UserService } from 'src/modules/user/user.service';
import { AuthInput } from './auth.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Logs in a user with the provided authentication credentials.
   * @param auth - The authentication input containing the email and password.
   * @param response - The HTTP response object.
   * @returns A promise that resolves to an object indicating successful login.
   * @throws UnauthorizedException if the user or password is invalid.
   * @throws ForbiddenException if token generation fails.
   */
  async loginUser(auth: AuthInput, response): Promise<any> {
    const { email, password } = auth;
    const user = await this.userService.getUserByEmail(email);

    if (!user) {
      throw new UnauthorizedException('User or password invalid!');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      throw new UnauthorizedException('User or password invalid!');
    }

    const access_token = await this.jwtService.signAsync({
      email: user.email,
      sub: user._id,
    });

    if (!access_token) {
      throw new ForbiddenException('Token generation failed');
    }

    response.cookie('access_token', access_token);

    return { loggedIn: true };
  }

  /**
   * Logs out the user by clearing the access token cookie.
   * @param {Response} response - The HTTP response object.
   * @returns {Promise<any>} - A promise that resolves to an object indicating that the user has been logged out.
   */
  async logoutUser(response): Promise<any> {
    response.clearCookie('access_token');
    return { loggedOut: true };
  }
}
