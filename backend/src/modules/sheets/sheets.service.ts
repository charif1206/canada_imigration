import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google } from 'googleapis';

@Injectable()
export class SheetsService {
  private readonly logger = new Logger(SheetsService.name);
  private sheets;
  private readonly spreadsheetId: string;

  constructor(private configService: ConfigService) {
    this.spreadsheetId = this.configService.get<string>('GOOGLE_SHEETS_ID');
    this.initializeGoogleSheets();
  }

  private async initializeGoogleSheets() {
    try {
      const serviceAccountEmail = this.configService.get<string>('GOOGLE_SERVICE_ACCOUNT_EMAIL');
      const privateKey = this.configService.get<string>('GOOGLE_PRIVATE_KEY')?.replace(/\\n/g, '\n');

      if (!serviceAccountEmail || !privateKey) {
        this.logger.warn('Google Sheets credentials not configured.');
        return;
      }

      const auth = new google.auth.JWT(
        serviceAccountEmail,
        null,
        privateKey,
        ['https://www.googleapis.com/auth/spreadsheets'],
      );

      this.sheets = google.sheets({ version: 'v4', auth });
      this.logger.log('Google Sheets service initialized');
    } catch (error) {
      this.logger.error(`Failed to initialize Google Sheets: ${error}`);
    }
  }

  async sendDataToSheet(clientData: any): Promise<void> {
    try {
      if (!this.sheets || !this.spreadsheetId) {
        this.logger.warn('Google Sheets not configured. Data not sent.');
        this.logger.log(`Client data: ${JSON.stringify(clientData)}`);
        return;
      }

      const values = [
        [
          clientData.id,
          clientData.name,
          clientData.email,
          clientData.phone,
          clientData.passportNumber || '',
          clientData.nationality || '',
          clientData.dateOfBirth || '',
          clientData.address || '',
          clientData.immigrationType || '',
          clientData.isValidated ? 'Yes' : 'No',
          new Date(clientData.createdAt).toLocaleString(),
        ],
      ];

      await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: 'Sheet1!A:K',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values,
        },
      });

      this.logger.log(`Data sent to Google Sheets for client: ${clientData.name}`);
    } catch (error) {
      this.logger.error(`Failed to send data to Google Sheets: ${error}`);
      // Don't throw error to prevent blocking the main flow
    }
  }

  async createHeaderRow(): Promise<void> {
    try {
      if (!this.sheets || !this.spreadsheetId) {
        return;
      }

      const headers = [
        [
          'Client ID',
          'Name',
          'Email',
          'Phone',
          'Passport Number',
          'Nationality',
          'Date of Birth',
          'Address',
          'Immigration Type',
          'Validated',
          'Created At',
        ],
      ];

      await this.sheets.spreadsheets.values.update({
        spreadsheetId: this.spreadsheetId,
        range: 'Sheet1!A1:K1',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: headers,
        },
      });

      this.logger.log('Header row created in Google Sheets');
    } catch (error) {
      this.logger.error(`Failed to create header row: ${error}`);
    }
  }
}