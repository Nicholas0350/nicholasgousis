import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { insertCreditLicenseeSchema, type NewCreditLicensee } from '../../src/db/schema/credit_licensees';

config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface ASICResponse {
  success: boolean;
  result: {
    records: Array<{
      REGISTER_NAME: string;
      CRED_LIC_NUM: string;
      CRED_LIC_NAME: string;
      CRED_LIC_START_DT: string;
      CRED_LIC_END_DT: string;
      CRED_LIC_STATUS: string;
      CRED_LIC_ABN_ACN: string;
      CRED_LIC_AFSL_NUM: string;
      CRED_LIC_STATUS_HISTORY: string;
      CRED_LIC_LOCALITY: string;
      CRED_LIC_STATE: string;
      CRED_LIC_PCODE: string;
      CRED_LIC_LAT: string;
      CRED_LIC_LNG: string;
      CRED_LIC_EDRS: string;
      CRED_LIC_BN: string;
      CRED_LIC_AUTHORISATIONS: string;
    }>;
    total: number;
  };
}

async function fetchCreditLicenseeData(limit = 10, offset = 0): Promise<ASICResponse> {
  // Direct access to the datastore
  const url = new URL('https://data.gov.au/data/api/3/action/datastore_search');
  const resourceId = '3abf1383-c4e5-4c1a-8331-8434b17b6f10';  // Updated resource ID
  url.searchParams.append('resource_id', resourceId);
  url.searchParams.append('limit', limit.toString());
  url.searchParams.append('offset', offset.toString());

  console.log('Fetching credit licensee data...');
  console.log('Resource ID:', resourceId);

  const response = await fetch(url.toString());
  if (!response.ok) {
    console.error('Error response:', await response.text());
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  if (!data.success) {
    throw new Error('API request failed');
  }

  if (data.result && data.result.records && data.result.records.length > 0) {
    console.log('\nSample record:', JSON.stringify(data.result.records[0], null, 2));
  } else {
    console.log('No records found');
  }

  return data;
}

function transformRecord(record: ASICResponse['result']['records'][0]): NewCreditLicensee {
  return {
    REGISTER_NAME: record.REGISTER_NAME,
    CRED_LIC_NUM: String(record.CRED_LIC_NUM),
    CRED_LIC_NAME: record.CRED_LIC_NAME,
    CRED_LIC_START_DT: record.CRED_LIC_START_DT,
    CRED_LIC_END_DT: record.CRED_LIC_END_DT,
    CRED_LIC_STATUS: record.CRED_LIC_STATUS,
    CRED_LIC_ABN_ACN: String(record.CRED_LIC_ABN_ACN),
    CRED_LIC_AFSL_NUM: String(record.CRED_LIC_AFSL_NUM),
    CRED_LIC_STATUS_HISTORY: record.CRED_LIC_STATUS_HISTORY,
    CRED_LIC_LOCALITY: record.CRED_LIC_LOCALITY,
    CRED_LIC_STATE: record.CRED_LIC_STATE,
    CRED_LIC_PCODE: record.CRED_LIC_PCODE,
    CRED_LIC_LAT: String(record.CRED_LIC_LAT),
    CRED_LIC_LNG: String(record.CRED_LIC_LNG),
    CRED_LIC_EDRS: record.CRED_LIC_EDRS,
    CRED_LIC_BN: record.CRED_LIC_BN,
    CRED_LIC_AUTHORISATIONS: record.CRED_LIC_AUTHORISATIONS
  };
}

async function importCreditLicenseeData(sampleSize = 10) {
  try {
    console.log(`Starting Credit Licensee data import from ASIC (sample size: ${sampleSize})...`);
    const limit = sampleSize;
    let processed = 0;
    let failed = 0;

    const response = await fetchCreditLicenseeData(limit, 0);
    if (!response.success || !response.result.records.length) {
      console.log('No records found');
      return;
    }

    const records = response.result.records.map(transformRecord);

    try {
      const validatedRecords = records.map(record => {
        const validated = insertCreditLicenseeSchema.parse(record);
        return validated;
      });

      console.log('\nAttempting to insert records...');

      const { error } = await supabase
        .from('credit_licensees')
        .upsert(validatedRecords, {
          onConflict: 'CRED_LIC_NUM',
          ignoreDuplicates: false
        })
        .select();

      if (error) {
        console.error('Insert error:', error);
        throw error;
      }

      processed = validatedRecords.length;
      console.log(`Successfully processed ${processed} records`);
    } catch (error) {
      console.error('Validation error:', error);
      failed++;
    }

    console.log(`\nImport complete. Processed: ${processed}, Failed: ${failed}`);
  } catch (error) {
    console.error('Import failed:', error);
  }
}

async function main() {
  await importCreditLicenseeData(10);
  process.exit(0);
}

main();
