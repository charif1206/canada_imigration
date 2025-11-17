import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { JwtExceptionFilter } from './common/filters/jwt-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for frontend communication
  const allowedOrigins = [
    'http://localhost:3001', 
    'http://localhost:3000',
    'http://localhost:3002',
    'https://canada-immigration-frontend-g1d7wgthr.vercel.app',
    'https://canada-immigration-admin-4cdwbvozc.vercel.app',
    'https://canada-immigration-frontend-efapaao7f.vercel.app',
    'https://canada-immigration-admin-p6xxsmfwh.vercel.app',
    process.env.FRONTEND_URL,
    process.env.ADMIN_URL,
  ].filter(Boolean);
  
  app.enableCors({
    origin: allowedOrigins,
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