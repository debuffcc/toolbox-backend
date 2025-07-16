import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3000', // 또는 true로 하면 모든 도메인 허용
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 3100);
}
bootstrap();
