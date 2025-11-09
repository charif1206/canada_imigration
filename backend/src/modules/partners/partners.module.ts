import { Module } from '@nestjs/common';
import { PartnersController } from './partners.controller';
import { PartnersService } from './partners.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { SheetsModule } from '../sheets/sheets.module';

@Module({
  imports: [PrismaModule, SheetsModule],
  controllers: [PartnersController],
  providers: [PartnersService],
  exports: [PartnersService],
})
export class PartnersModule {}
