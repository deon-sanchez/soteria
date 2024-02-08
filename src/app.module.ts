import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { join } from 'path';

import { UserModule } from './modules/user/user.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guard/jwt-auth.guard';

/**
 * Represents the main module of the application.
 * This module is responsible for importing and configuring various modules used in the application.
 */
@Module({
  imports: [
    // Config module
    ConfigModule.forRoot({
      load: [],
      isGlobal: true,
    }),
    // GraphQL module
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        autoSchemaFile: join(process.cwd(), 'src/graphql/schema/schema.gql'),
        installSubscriptionHandlers: true,
        path: 'auth/graphql',
        context: ({ req, res }) => ({ req, res }),
        cors: {
          credentials: true,
          origin: true,
        },
        sortSchema: true,
        playground: {
          settings: {
            'request.credentials': 'include',
          },
        },
        debug: configService.get<boolean>('DEBUG'),
        uploads: false,
      }),
    }),
    // Mongo module
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('MONGO_URI'),
      }),
    }),
    UserModule,
    AuthModule,
  ],
  controllers: [],
  providers: [
    // Auth Guard
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
