import { Module } from '@nestjs/common';
import { FormsController } from './forms.controller';
import { FormsService } from './forms.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { SheetsModule } from '../sheets/sheets.module';

@Module({
  imports: [PrismaModule, SheetsModule],
  controllers: [FormsController],
  providers: [FormsService],
  exports: [FormsService],
})
export class FormsModule {}
