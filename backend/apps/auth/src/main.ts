import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  app.enableCors({ origin: true, credentials: true });
  await app.listen(Number(process.env.PORT ?? 3001));
}
void bootstrap();
