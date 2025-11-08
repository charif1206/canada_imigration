import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { JwtExceptionFilter } from './common/filters/jwt-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for frontend communication
  app.enableCors({
    origin: ['http://localhost:3001', 'http://localhost:3000','http://localhost:3002'],
    credentials: true,
  });

  // Enable global validation with descriptive messages
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors) => {
        // Custom error messages for validation errors
        const messages = errors.map((error) => {
          return Object.values(error.constraints || {}).join(', ');
        });
        return {
          statusCode: 400,
          message: messages,
          error: 'Bad Request',
        };
      },
    }),
  );

  // Enable global JWT exception filter for better error messages
  app.useGlobalFilters(new JwtExceptionFilter());

  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📊 Admin Panel: http://localhost:${port}/admin`);
}
bootstrap();