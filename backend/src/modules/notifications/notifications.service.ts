import { Injectable, Logger } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(private readonly notificationsGateway: NotificationsGateway) {}

  notifyClientCreation(clientId: string) {
    this.logger.log(`Notifying about new client: ${clientId}`);
    this.notificationsGateway.server.emit('client-created', {
      clientId,
      message: 'New client registered',
      timestamp: new Date().toISOString(),
    });
  }

  notifyClientValidation(clientId: string, isValidated: boolean) {
    this.logger.log(`Notifying client ${clientId} about validation: ${isValidated}`);
    this.notificationsGateway.server.emit(`validation-${clientId}`, {
      clientId,
      isValidated,
      message: isValidated ? 'Your application has been validated' : 'Your application needs review',
      timestamp: new Date().toISOString(),
    });
  }

  notifyNewMessage(messageId: string, clientId: string) {
    this.logger.log(`Notifying about new message from client: ${clientId}`);
    this.notificationsGateway.server.emit('new-message', {
      messageId,
      clientId,
      message: 'New message received',
      timestamp: new Date().toISOString(),
    });
  }

  sendToAdmin(event: string, data: any) {
    this.logger.log(`Sending to admin: ${event}`);
    this.notificationsGateway.server.emit(`admin-${event}`, data);
  }
}