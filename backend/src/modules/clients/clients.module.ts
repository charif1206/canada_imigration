import { Module } from '@nestjs/common';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { WhatsAppModule } from '../whatsapp/whatsapp.module';
import { SheetsModule } from '../sheets/sheets.module';

@Module({
  imports: [PrismaModule, NotificationsModule, WhatsAppModule, SheetsModule],
  controllers: [ClientsController],
  providers: [ClientsService],
})
export class ClientsModule {}