import { PrismaService } from '../../../prisma/prisma.service';
import { Logger } from '@nestjs/common';
import { CLIENT_UPDATE_FIELDS, FORM_STATUS } from '../constants/forms.constants';
import { formatLogMessage } from './file-upload.helper';
import { LOG_MESSAGES } from '../constants/forms.constants';

const logger = new Logger('ClientUpdateHelper');

/**
 * Update client status for equivalence form
 * @param prisma - Prisma service instance
 * @param clientId - Client ID
 * @param fileUrl - Uploaded file URL (optional)
 */
export async function updateClientEquivalenceStatus(
  prisma: PrismaService,
  clientId: string,
  fileUrl: string | null,
): Promise<void> {
  const fields = CLIENT_UPDATE_FIELDS.EQUIVALENCE;
  
  await prisma.client.update({
    where: { id: clientId },
    data: {
      [fields.FLAG]: true,
      [fields.STATUS]: FORM_STATUS.PENDING,
      [fields.REJECTED_AT]: null,
      [fields.REJECTION_REASON]: null,
      [fields.FOLDER]: fileUrl,
    },
  });

  logger.log(
    formatLogMessage(LOG_MESSAGES.CLIENT_UPDATED, {
      clientId,
      type: 'equivalence',
      status: FORM_STATUS.PENDING,
    }),
  );

  if (fileUrl) {
    logger.log(formatLogMessage(LOG_MESSAGES.CLIENT_FOLDER_SAVED, { clientId }));
  }
}

/**
 * Update client status for residence form
 * @param prisma - Prisma service instance
 * @param clientId - Client ID
 * @param fileUrl - Uploaded file URL (optional)
 */
export async function updateClientResidenceStatus(
  prisma: PrismaService,
  clientId: string,
  fileUrl: string | null,
): Promise<void> {
  const fields = CLIENT_UPDATE_FIELDS.RESIDENCE;
  
  await prisma.client.update({
    where: { id: clientId },
    data: {
      [fields.FLAG]: true,
      [fields.STATUS]: FORM_STATUS.PENDING,
      [fields.REJECTED_AT]: null,
      [fields.REJECTION_REASON]: null,
      [fields.FOLDER]: fileUrl,
    },
  });

  logger.log(
    formatLogMessage(LOG_MESSAGES.CLIENT_UPDATED, {
      clientId,
      type: 'residence',
      status: FORM_STATUS.PENDING,
    }),
  );

  if (fileUrl) {
    logger.log(formatLogMessage(LOG_MESSAGES.CLIENT_FOLDER_SAVED, { clientId }));
  }
}

/**
 * Update client status for partner form
 * @param prisma - Prisma service instance
 * @param clientId - Client ID
 */
export async function updateClientPartnerStatus(
  prisma: PrismaService,
  clientId: string,
): Promise<void> {
  const fields = CLIENT_UPDATE_FIELDS.PARTNER;
  
  await prisma.client.update({
    where: { id: clientId },
    data: {
      [fields.FLAG]: true,
      [fields.STATUS]: FORM_STATUS.PENDING,
      [fields.REJECTED_AT]: null,
      [fields.REJECTION_REASON]: null,
    },
  });

  logger.log(
    formatLogMessage(LOG_MESSAGES.CLIENT_UPDATED, {
      clientId,
      type: 'partner',
      status: FORM_STATUS.PENDING,
    }),
  );
}
