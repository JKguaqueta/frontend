import { NestFactory } from '@nestjs/core';
import { UsersModule } from './users.module';

async function bootstrap() {
  const app = await NestFactory.create(UsersModule);
  app.enableCors({ origin: true, credentials: true });
  await app.listen(Number(process.env.PORT ?? 3002));
}
void bootstrap();
