import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(8082, () => {
    Logger.log('Assistant Service is running on port 8082!');
  });
}
bootstrap();
