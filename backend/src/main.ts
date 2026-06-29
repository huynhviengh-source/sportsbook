import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });
  const config = new DocumentBuilder()
    .setTitle('SportsBook API')
    .setDescription('API đặt sân thể thao')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  SwaggerModule.setup('api/docs', app, SwaggerModule.createDocument(app, config));
  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 Server: http://localhost:${port}`);
  console.log(`📖 Swagger: http://localhost:${port}/api/docs`);
}
bootstrap();