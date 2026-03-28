import { NestFactory } from '@nestjs/core';
import { PostsModule } from './posts.module';

async function bootstrap() {
  const app = await NestFactory.create(PostsModule);
  app.enableCors({ origin: true, credentials: true });
  await app.listen(Number(process.env.PORT ?? 3003));
}
void bootstrap();
