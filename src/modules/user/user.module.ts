import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from '../../graphql/resolvers/user.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { UserResponse, UserSchema } from 'src/modules/user/user.entity';

@Module({
  exports: [UserService],
  imports: [
    MongooseModule.forFeature([
      { schema: UserSchema, name: UserResponse.name },
    ]),
  ],
  providers: [UserService, UserResolver],
})
export class UserModule {}
