import { PrismaService } from '../../../prisma/prisma.service';
import { Logger } from '@nestjs/common';
import { PARTNER_STATUS } from '../constants/partners.constants';
import { formatLogMessage } from './log.helper';
import { LOG_MESSAGES } from '../constants/partners.constants';

const logger = new Logger('ClientUpdateHelper');

/**
 * Update client status for partner application
 * @param prisma - Prisma service instance
 * @param clientId - Client ID
 */
export async function updateClientPartnerStatus(
  prisma: PrismaService,
  clientId: string,
): Promise<void> {
  await prisma.client.update({
    where: { id: clientId },
    data: {
      isSendingPartners: true,
      partnerStatus: PARTNER_STATUS.PENDING,
    },
  });

  logger.log(formatLogMessage(LOG_MESSAGES.CLIENT_UPDATED, { clientId }));
}
