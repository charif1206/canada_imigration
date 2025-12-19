import { Module } from '@nestjs/common';
import { BlogsController } from './blogs.controller';
import { BlogsService } from './blogs.service';
import { PrismaService } from '../../prisma/prisma.service';
import { CloudinaryModule } from '../../cloudinary/cloudinary.module';

@Module({
  imports: [CloudinaryModule],
  controllers: [BlogsController],
  providers: [BlogsService, PrismaService],
  exports: [BlogsService],
})
export class BlogsModule {}
