import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/modules/user/user.service';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { AuthInput } from '../auth.entity';

/**
 * JwtStrategy class that extends PassportStrategy and implements JWT authentication strategy.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJWTFromCookie,
      ]),
      secretOrKey: configService.get('JWT_SECRET'),
      ignoreExpiration: false,
    });
  }

  /**
   * Extracts JWT token from the request cookie.
   * @param req - The request object.
   * @returns The JWT token extracted from the cookie, or null if not found.
   */
  private static extractJWTFromCookie(req: Request): string | null {
    if (req.cookies && req.cookies.access_token) {
      return req.cookies.access_token;
    }
    return null;
  }

  /**
   * Validates the JWT token and returns the authenticated user.
   * @param auth - The authentication input containing the user's email.
   * @returns The authenticated user.
   * @throws UnauthorizedException if the user is not found.
   */
  async validate(auth: AuthInput): Promise<any> {
    const user = await this.userService.getUserByEmail(auth.email);

    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
