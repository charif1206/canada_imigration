// lib/utils/googleSheets.ts
/**
 * Send form data to Google Sheets via Apps Script Web App
 * URL: https://script.google.com/macros/s/AKfycbyqZYfDQv9CNnzkxxfbcryEDQnY3n0bBRD7hxsCkumJ2MxWqZmX61zJKfrZ2ThdWqx6sQ/exec
 */

const GOOGLE_SHEETS_URL =
  'https://script.google.com/macros/s/AKfycbyqZYfDQv9CNnzkxxfbcryEDQnY3n0bBRD7hxsCkumJ2MxWqZmX61zJKfrZ2ThdWqx6sQ/exec';

export interface GoogleSheetsPayload {
  formType: 'equivalence' | 'residence' | 'partner' | 'client';
  clientId?: string;
  [key: string]: string | boolean | undefined;
}

/**
 * Send data to Google Sheets
 * This function sends form submission data to Google Sheets for archival
 * It does NOT block the main form submission if it fails
 */
export const sendToGoogleSheets = async (
  payload: GoogleSheetsPayload
): Promise<void> => {
  try {
    await fetch(GOOGLE_SHEETS_URL, {
      method: 'POST',
      body: JSON.stringify(payload),
      mode: 'no-cors', // Important: CORS will prevent response reading but request will go through
    });

    console.log('✅ Data sent to Google Sheets:', payload.formType);
  } catch (error) {
    // Don't throw error - Google Sheets is backup, shouldn't block main submission
    console.warn('⚠️ Failed to send data to Google Sheets:', error);
  }
};

/**
 * Send equivalence form to Google Sheets
 */
export const sendEquivalenceToSheets = async (
  clientId: string,
  formData: Record<string, string | boolean | undefined>
): Promise<void> => {
  await sendToGoogleSheets({
    formType: 'equivalence',
    clientId,
    ...formData,
  });
};

/**
 * Send residence form to Google Sheets
 */
export const sendResidenceToSheets = async (
  clientId: string,
  formData: Record<string, string | boolean | undefined>
): Promise<void> => {
  await sendToGoogleSheets({
    formType: 'residence',
    clientId,
    ...formData,
  });
};

/**
 * Send partner form to Google Sheets
 */
export const sendPartnerToSheets = async (formData: {
  agencyName: string;
  managerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  clientCount: string;
  message: string;
}): Promise<void> => {
  await sendToGoogleSheets({
    formType: 'partner',
    ...formData,
  });
};

/**
 * Send client registration to Google Sheets
 */
export const sendClientToSheets = async (clientData: {
  id: string;
  name: string;
  email: string;
  nationality?: string;
  passportNumber?: string;
}): Promise<void> => {
  await sendToGoogleSheets({
    formType: 'client',
    ...clientData,
  });
};
