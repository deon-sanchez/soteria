/**
 * The main entry point of the Athena backend application.
 * Initializes the NestJS application, sets up global pipes and middleware,
 * enables CORS, and starts the server.
 */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

const PORT = process.env.PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  app.enableCors({ origin: true, credentials: true });

  await app.listen(PORT);
  console.log(
    `Application is running on: http://localhost:${PORT}/auth/graphql`,
  );
}

bootstrap();
