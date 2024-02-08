import { Field, InputType, ObjectType } from '@nestjs/graphql';

@InputType({ description: 'Auth Input' })
export class AuthInput {
  @Field()
  email: string;

  @Field()
  password: string;
}

@ObjectType({ description: 'Auth Response' })
export class LoginResponse {
  @Field((type) => Boolean)
  loggedIn: boolean;
}

@ObjectType({ description: 'Logout Response' })
export class LogoutResponse {
  @Field((type) => Boolean)
  loggedOut: boolean;
}
