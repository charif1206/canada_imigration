import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ClientsModule } from './modules/clients/clients.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { WhatsAppModule } from './modules/whatsapp/whatsapp.module';
import { SheetsModule } from './modules/sheets/sheets.module';
import { AdminModule } from './modules/admin/admin.module';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { FormsModule } from './modules/forms/forms.module';
import { PartnersModule } from './modules/partners/partners.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, '..', 'public', 'admin'),
    //   serveRoot: '/admin',
    // }),
    PrismaModule,
    AuthModule,
    ClientsModule,
    FormsModule,
    PartnersModule,
    NotificationsModule,
    WhatsAppModule,
    SheetsModule,
    AdminModule,
  ],
})
export class AppModule {}