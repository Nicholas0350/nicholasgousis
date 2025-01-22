import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import type { NewAFSLLicensee } from '../../src/db/schema/afsl_licensees';
import { insertAFSLLicenseeSchema } from '../../src/db/schema/afsl_licensees';

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
      AFS_LIC_NUM: string;
      AFS_LIC_NAME: string;
      AFS_LIC_ABN_ACN: string;
      AFS_LIC_START_DT: string;
      AFS_LIC_PRE_FSR: string;
      AFS_LIC_ADD_LOCAL: string;
      AFS_LIC_ADD_STATE: string;
      AFS_LIC_ADD_PCODE: string;
      AFS_LIC_ADD_COUNTRY: string;
      AFS_LIC_LAT: string;
      AFS_LIC_LNG: string;
      AFS_LIC_CONDITION: string;
    }>;
    total: number;
  };
}

async function fetchAFSLData(limit = 10, offset = 0): Promise<ASICResponse> {
  const url = new URL('https://data.gov.au/data/api/3/action/datastore_search');
  url.searchParams.append('resource_id', 'd98a113d-6b50-40e6-b65f-2612efc877f4');
  url.searchParams.append('limit', limit.toString());
  url.searchParams.append('offset', offset.toString());

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

function transformRecord(record: ASICResponse['result']['records'][0]): NewAFSLLicensee {
  return {
    REGISTER_NAME: record.REGISTER_NAME,
    AFS_LIC_NUM: String(record.AFS_LIC_NUM),
    AFS_LIC_NAME: record.AFS_LIC_NAME,
    AFS_LIC_ABN_ACN: String(record.AFS_LIC_ABN_ACN),
    AFS_LIC_START_DT: record.AFS_LIC_START_DT,
    AFS_LIC_PRE_FSR: record.AFS_LIC_PRE_FSR,
    AFS_LIC_ADD_LOCAL: record.AFS_LIC_ADD_LOCAL,
    AFS_LIC_ADD_STATE: record.AFS_LIC_ADD_STATE,
    AFS_LIC_ADD_PCODE: record.AFS_LIC_ADD_PCODE,
    AFS_LIC_ADD_COUNTRY: record.AFS_LIC_ADD_COUNTRY,
    AFS_LIC_LAT: String(record.AFS_LIC_LAT),
    AFS_LIC_LNG: String(record.AFS_LIC_LNG),
    AFS_LIC_CONDITION: record.AFS_LIC_CONDITION.substring(0, 255)
  };
}

async function importAFSLData(sampleSize = 10) {
  try {
    console.log(`Starting AFSL data import from ASIC (sample size: ${sampleSize})...`);
    const limit = sampleSize;
    let processed = 0;
    let failed = 0;

    const response = await fetchAFSLData(limit, 0);
    if (!response.success || !response.result.records.length) {
      console.log('No records found');
      return;
    }

    const records = response.result.records.map(transformRecord);

    try {
      const validatedRecords = records.map(record => {
        const validated = insertAFSLLicenseeSchema.parse(record);
        return validated;
      });

      console.log('\nAttempting to insert records...');

      const { data, error } = await supabase
        .from('afsl_licensees')
        .upsert(validatedRecords, {
          onConflict: 'AFS_LIC_NUM',
          ignoreDuplicates: false
        })
        .select();

      if (error) {
        console.error('Insert error:', error);
        throw error;
      }

      processed = validatedRecords.length;
      console.log('\nSuccessfully inserted records:', data?.length || 0);
    } catch (error) {
      console.error('Error processing records:', error);
      failed = records.length;
    }

    console.log(`\nImport completed: ${processed} processed, ${failed} failed`);
  } catch (error) {
    console.error('Error importing AFSL data:', error);
    throw error;
  }
}

async function main() {
  try {
    console.log('Starting AFSL data import...');
    await importAFSLData(100);
    console.log('Import completed');
  } catch (error) {
    console.error('Error in main:', error);
    process.exit(1);
  }
}

main();