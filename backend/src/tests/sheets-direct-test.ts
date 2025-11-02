import { Logger } from '@nestjs/common';
import { google } from 'googleapis';
import * as path from 'path';
import * as fs from 'fs';
import * as dotenv from 'dotenv';

/**
 * Direct test script for Google Sheets integration
 * This script loads .env manually and tests sending data directly
 * 
 * Usage: npx ts-node src/tests/sheets-direct-test.ts
 */

const logger = new Logger('SheetsDirectTest');

// Load .env file manually
const envPath = path.join(process.cwd(), '.env');
logger.log(`📂 Loading .env from: ${envPath}`);
dotenv.config({ path: envPath });

// Mock client data
const mockClientData = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  name: 'Direct Test User',
  email: 'directtest@example.com',
  phone: '+1-416-555-1234',
  passportNumber: 'CA987654321',
  nationality: 'Canadian',
  dateOfBirth: '1990-01-15',
  address: '456 Test Street, Toronto, ON M5V 2T6, Canada',
  immigrationType: 'skilled-worker',
  isValidated: false,
  createdAt: new Date(),
};

async function testDirectSheetsSend() {
  try {
    logger.log('╔════════════════════════════════════════════════════════╗');
    logger.log('║     DIRECT GOOGLE SHEETS TEST - HARDCODED DATA        ║');
    logger.log('╚════════════════════════════════════════════════════════╝');

    // Step 1: Load environment variables
    logger.log('\n📋 Step 1: Loading environment variables...');
    const googleSheetsId = process.env.GOOGLE_SHEETS_ID;
    const googleServiceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const googlePrivateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    const googleCredentialsPath = process.env.GOOGLE_CREDENTIALS_PATH;

    logger.log(`  ✅ GOOGLE_SHEETS_ID: ${googleSheetsId ? '✓ SET' : '❌ NOT SET'}`);
    logger.log(
      `  ✅ GOOGLE_SERVICE_ACCOUNT_EMAIL: ${googleServiceAccountEmail ? '✓ SET' : '❌ NOT SET'}`,
    );
    logger.log(`  ✅ GOOGLE_PRIVATE_KEY: ${googlePrivateKey ? '✓ SET' : '❌ NOT SET'}`);
    logger.log(
      `  ✅ GOOGLE_CREDENTIALS_PATH: ${googleCredentialsPath ? '✓ SET' : '❌ NOT SET'}`,
    );

    // Step 2: Initialize Google Sheets
    logger.log('\n🔧 Step 2: Initializing Google Sheets client...');

    let sheets;

    // Try credentials file first
    if (googleCredentialsPath) {
      const absolutePath = path.resolve(process.cwd(), googleCredentialsPath);
      logger.log(`  📁 Checking credentials file: ${absolutePath}`);

      if (fs.existsSync(absolutePath)) {
        logger.log(`  ✅ Credentials file found!`);
        const auth = new google.auth.GoogleAuth({
          keyFile: absolutePath,
          scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        sheets = google.sheets({ version: 'v4', auth });
        logger.log(`  ✅ Google Sheets initialized with credentials file`);
      } else {
        logger.warn(`  ⚠️ Credentials file not found at ${absolutePath}`);
        logger.log(`  📝 Falling back to environment variables...`);
      }
    } else {
      logger.log(`  📝 GOOGLE_CREDENTIALS_PATH not set, using environment variables...`);
    }

    // Fallback to environment variables
    if (!sheets) {
      if (!googleServiceAccountEmail || !googlePrivateKey) {
        logger.error('  ❌ Missing GOOGLE_SERVICE_ACCOUNT_EMAIL or GOOGLE_PRIVATE_KEY');
        logger.error('     Please check .env file');
        process.exit(1);
      }

      logger.log(`  🔑 Using environment variables`);
      logger.log(`  📧 Service Account: ${googleServiceAccountEmail.substring(0, 30)}...`);

      const auth = new google.auth.JWT(
        googleServiceAccountEmail,
        null,
        googlePrivateKey,
        ['https://www.googleapis.com/auth/spreadsheets'],
      );

      sheets = google.sheets({ version: 'v4', auth });
      logger.log(`  ✅ Google Sheets initialized with environment variables`);
    }

    // Step 3: Validate spreadsheet
    logger.log('\n📋 Step 3: Validating spreadsheet...');

    if (!googleSheetsId) {
      logger.error('  ❌ GOOGLE_SHEETS_ID is not set!');
      process.exit(1);
    }

    logger.log(`  ✅ Spreadsheet ID: ${googleSheetsId}`);

    // Step 4: Prepare mock data
    logger.log('\n📝 Step 4: Preparing mock client data...');
    logger.log(`  Name: ${mockClientData.name}`);
    logger.log(`  Email: ${mockClientData.email}`);
    logger.log(`  Phone: ${mockClientData.phone}`);
    logger.log(`  ID: ${mockClientData.id}`);

    // Step 5: Format data as array
    logger.log('\n✏️ Step 5: Formatting data as array...');

    const values = [
      [
        mockClientData.id || '',
        mockClientData.name || '',
        mockClientData.email || '',
        mockClientData.phone || '',
        mockClientData.passportNumber || '',
        mockClientData.nationality || '',
        mockClientData.dateOfBirth || '',
        mockClientData.address || '',
        mockClientData.immigrationType || '',
        mockClientData.isValidated ? 'Yes' : 'No',
        new Date(mockClientData.createdAt).toLocaleString(),
      ],
    ];

    logger.log(`  ✅ Row formatted with ${values[0].length} columns:`);
    values[0].forEach((value, index) => {
      const columns = [
        'ID',
        'Name',
        'Email',
        'Phone',
        'Passport',
        'Nationality',
        'DOB',
        'Address',
        'Immigration Type',
        'Validated',
        'Created At',
      ];
      logger.debug(`     Column ${String.fromCharCode(65 + index)} (${columns[index]}): ${value}`);
    });

    // Step 6: Send to Google Sheets
    logger.log('\n🔗 Step 6: Sending data to Google Sheets...');
    const startTime = Date.now();

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: googleSheetsId,
      range: 'Sheet1!A:K',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values,
      },
    });

    const duration = Date.now() - startTime;

    // Step 7: Success!
    logger.log('\n✅ SUCCESS! Data sent to Google Sheets!');
    logger.log(`  Duration: ${duration}ms`);
    logger.log(`  Updated rows: ${response.data.updates?.updatedRows || 0}`);
    logger.log(`  Updated cells: ${response.data.updates?.updatedCells || 0}`);
    logger.log(`  Updated range: ${response.data.updates?.updatedRange || 'N/A'}`);

    logger.log('\n📊 Response Details:');
    logger.log(JSON.stringify(response.data.updates, null, 2));

    logger.log('\n╔════════════════════════════════════════════════════════╗');
    logger.log('║            ✅ TEST COMPLETED SUCCESSFULLY             ║');
    logger.log('║                                                        ║');
    logger.log('║  Check your Google Sheet - new row should appear!     ║');
    logger.log('║  Data sent for: ' + mockClientData.name.padEnd(27) + '║');
    logger.log('║  Email: ' + mockClientData.email.padEnd(43) + '║');
    logger.log('╚════════════════════════════════════════════════════════╝');

    process.exit(0);
  } catch (error: any) {
    logger.error('\n❌ ERROR OCCURRED!');
    logger.error(`Error: ${error.message}`);
    logger.error(`Error Code: ${error.code}`);

    if (error.code === 404) {
      logger.error('\n🔍 Problem: Spreadsheet not found');
      logger.error('   Fix: Check GOOGLE_SHEETS_ID in .env');
      logger.error(`   Current ID: ${process.env.GOOGLE_SHEETS_ID}`);
    } else if (error.code === 403) {
      logger.error('\n🔍 Problem: Permission denied');
      logger.error('   Fix: Share Google Sheet with service account');
      logger.error(`   Email: ${process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL}`);
    } else if (error.message?.includes('Invalid Credentials')) {
      logger.error('\n🔍 Problem: Invalid credentials');
      logger.error('   Fix: Check GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_PRIVATE_KEY');
    } else {
      logger.error('\n🔍 Full error:');
      logger.error(JSON.stringify(error, null, 2));
    }

    logger.log('\n╔════════════════════════════════════════════════════════╗');
    logger.log('║                  ❌ TEST FAILED                        ║');
    logger.log('╚════════════════════════════════════════════════════════╝');

    process.exit(1);
  }
}

// Run the test
testDirectSheetsSend();
