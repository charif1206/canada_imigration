import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google } from 'googleapis';
import * as path from 'path';
import * as fs from 'fs';

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
      this.logger.log('[SHEETS] 🔧 Initializing Google Sheets service...');

      // Try to use credentials file path first
      const credentialsPath = this.configService.get<string>('GOOGLE_CREDENTIALS_PATH');
      
      if (credentialsPath) {
        this.logger.debug(`[SHEETS] 📁 Checking for credentials file at: ${credentialsPath}`);
        const absolutePath = path.resolve(process.cwd(), credentialsPath);
        
        if (fs.existsSync(absolutePath)) {
          this.logger.log(`[SHEETS] 📂 Loading Google credentials from file: ${absolutePath}`);
          
          const auth = new google.auth.GoogleAuth({
            keyFile: absolutePath,
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
          });

          this.sheets = google.sheets({ version: 'v4', auth });
          this.logger.log('[SHEETS] ✅ Google Sheets service initialized with credentials file');
          this.logger.debug(`[SHEETS] Spreadsheet ID: ${this.spreadsheetId || 'NOT SET'}`);
          return;
        } else {
          this.logger.warn(`[SHEETS] ⚠️ Credentials file not found at: ${absolutePath}`);
          this.logger.debug(`[SHEETS] Will attempt to use environment variables instead`);
        }
      } else {
        this.logger.debug(`[SHEETS] 📝 GOOGLE_CREDENTIALS_PATH not set, trying environment variables`);
      }

      // Fallback to environment variables
      const serviceAccountEmail = this.configService.get<string>('GOOGLE_SERVICE_ACCOUNT_EMAIL');
      const privateKey = this.configService.get<string>('GOOGLE_PRIVATE_KEY')?.replace(/\\n/g, '\n');

      if (!serviceAccountEmail) {
        this.logger.warn('[SHEETS] ⚠️ GOOGLE_SERVICE_ACCOUNT_EMAIL environment variable is not set');
      }
      if (!privateKey) {
        this.logger.warn('[SHEETS] ⚠️ GOOGLE_PRIVATE_KEY environment variable is not set');
      }

      if (!serviceAccountEmail || !privateKey) {
        this.logger.error(
          '[SHEETS] ❌ Google Sheets credentials not configured. ' +
          'Set either GOOGLE_CREDENTIALS_PATH or both GOOGLE_SERVICE_ACCOUNT_EMAIL + GOOGLE_PRIVATE_KEY'
        );
        return;
      }

      this.logger.debug(`[SHEETS] 🔑 Authenticating with service account: ${serviceAccountEmail}`);

      const auth = new google.auth.JWT(
        serviceAccountEmail,
        null,
        privateKey,
        ['https://www.googleapis.com/auth/spreadsheets'],
      );

      this.sheets = google.sheets({ version: 'v4', auth });
      this.logger.log('[SHEETS] ✅ Google Sheets service initialized with environment variables');
      this.logger.debug(`[SHEETS] Spreadsheet ID: ${this.spreadsheetId || 'NOT SET'}`);
    } catch (error) {
      const err = error as any;
      this.logger.error(`[SHEETS] ❌ Failed to initialize Google Sheets: ${err?.message || String(error)}`);
      this.logger.debug(`[SHEETS] Error details: ${JSON.stringify(error)}`);
    }
  }

  async sendDataToSheet(clientData: any): Promise<void> {
    const startTime = Date.now();
    const clientId = clientData?.id;
    const clientName = clientData?.name;
    const clientEmail = clientData?.email;

    try {
      this.logger.debug(`[SHEETS] 📤 Starting data send for client: ${clientName} (${clientEmail})`);

      // Step 1: Validate configuration
      if (!this.sheets) {
        this.logger.warn(`[SHEETS] ⚠️ Google Sheets client not initialized. Spreadsheet ID: ${this.spreadsheetId || 'NOT SET'}`);
        this.logger.debug(`[SHEETS] Client data: ${JSON.stringify(clientData)}`);
        return;
      }

      if (!this.spreadsheetId) {
        this.logger.error('[SHEETS] ❌ GOOGLE_SHEETS_ID environment variable is not set');
        this.logger.debug(`[SHEETS] Please set GOOGLE_SHEETS_ID in your .env file`);
        return;
      }

      // Step 2: Prepare data row
      this.logger.debug(`[SHEETS] 📋 Preparing data row for client ID: ${clientId}`);
      
      const values = [
        [
          clientData.id || '',
          clientData.name || '',
          clientData.email || '',
          clientData.phone || '',
          clientData.passportNumber || '',
          clientData.nationality || '',
          clientData.dateOfBirth || '',
          clientData.address || '',
          clientData.immigrationType || '',
          clientData.isValidated ? 'Yes' : 'No',
          new Date(clientData.createdAt).toLocaleString(),
        ],
      ];

      this.logger.debug(`[SHEETS] ✏️ Row prepared with ${values[0].length} columns`);

      // Step 3: Append to spreadsheet
      this.logger.debug(`[SHEETS] 🔗 Connecting to spreadsheet: ${this.spreadsheetId}`);
      
      const response = await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: 'Sheet1!A:K',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values,
        },
      });

      const duration = Date.now() - startTime;
      this.logger.log(
        `[SHEETS] ✅ SUCCESS - Data sent to Google Sheets for client: ${clientName} (${clientEmail}) | ` +
        `Updates: ${response.data.updates?.updatedRows || 0} rows | Duration: ${duration}ms`
      );

      if (response.data.updates?.updatedCells) {
        this.logger.debug(`[SHEETS] 📊 Updated ${response.data.updates.updatedCells} cells in range ${response.data.updates.updatedRange}`);
      }
    } catch (error) {
      const err = error as any;
      const duration = Date.now() - startTime;
      
      if (err?.code === 404) {
        this.logger.error(
          `[SHEETS] ❌ ERROR 404 - Spreadsheet not found. ` +
          `Invalid GOOGLE_SHEETS_ID: ${this.spreadsheetId} | Duration: ${duration}ms`
        );
      } else if (err?.code === 403) {
        this.logger.error(
          `[SHEETS] ❌ ERROR 403 - Permission denied. The service account doesn't have access to this spreadsheet. ` +
          `Please share the spreadsheet with the service account email. | Duration: ${duration}ms`
        );
      } else if (err?.message?.includes('Invalid Credentials')) {
        this.logger.error(
          `[SHEETS] ❌ ERROR - Google credentials are invalid. ` +
          `Check GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_PRIVATE_KEY in .env | Duration: ${duration}ms`
        );
      } else {
        this.logger.error(
          `[SHEETS] ❌ ERROR - Failed to send data to Google Sheets for client: ${clientName} (${clientEmail}) | ` +
          `Error: ${err?.message || String(error)} | Error Code: ${err?.code || 'UNKNOWN'} | Duration: ${duration}ms`
        );
      }

      this.logger.debug(`[SHEETS] 🔍 Full error object: ${JSON.stringify(error)}`);
      // Don't throw error to prevent blocking the main flow
    }
  }

  async createHeaderRow(): Promise<void> {
    const startTime = Date.now();

    try {
      this.logger.debug(`[SHEETS] 📋 Creating header row...`);

      if (!this.sheets) {
        this.logger.warn(`[SHEETS] ⚠️ Google Sheets client not initialized. Cannot create header row.`);
        return;
      }

      if (!this.spreadsheetId) {
        this.logger.error('[SHEETS] ❌ GOOGLE_SHEETS_ID is not set. Cannot create header row.');
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

      this.logger.debug(`[SHEETS] 🔗 Writing headers to spreadsheet: ${this.spreadsheetId}`);

      const response = await this.sheets.spreadsheets.values.update({
        spreadsheetId: this.spreadsheetId,
        range: 'Sheet1!A1:K1',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: headers,
        },
      });

      const duration = Date.now() - startTime;
      this.logger.log(
        `[SHEETS] ✅ SUCCESS - Header row created | ` +
        `Updated cells: ${response.data.updatedCells} | Duration: ${duration}ms`
      );
    } catch (error) {
      const err = error as any;
      const duration = Date.now() - startTime;

      if (err?.code === 404) {
        this.logger.error(
          `[SHEETS] ❌ ERROR 404 - Spreadsheet not found. Invalid GOOGLE_SHEETS_ID: ${this.spreadsheetId} | Duration: ${duration}ms`
        );
      } else if (err?.code === 403) {
        this.logger.error(
          `[SHEETS] ❌ ERROR 403 - Permission denied. Share the spreadsheet with the service account email. | Duration: ${duration}ms`
        );
      } else {
        this.logger.error(
          `[SHEETS] ❌ Failed to create header row: ${err?.message || String(error)} | Error Code: ${err?.code || 'UNKNOWN'} | Duration: ${duration}ms`
        );
      }

      this.logger.debug(`[SHEETS] 🔍 Full error: ${JSON.stringify(error)}`);
    }
  }
}