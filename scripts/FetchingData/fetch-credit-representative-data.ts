import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { insertCreditRepresentativeSchema, type NewCreditRepresentative, edrsTypes, authorizationTypes } from '../../src/db/schema/credit_representatives';

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
      CRED_REP_NUM: string;
      CRED_LIC_NUM: string;
      CRED_REP_NAME: string;
      CRED_REP_ABN_ACN: string | null;
      CRED_REP_START_DT: string;
      CRED_REP_END_DT: string | null;
      CRED_REP_LOCALITY: string | null;
      CRED_REP_STATE: string | null;
      CRED_REP_PCODE: string | null;
      CRED_REP_EDRS: string;
      CRED_REP_AUTHORISATIONS: string;
      CRED_REP_CROSS_ENDORSE: string | null;
    }>;
    total: number;
  };
}

async function fetchCreditRepresentativeData(limit = 10, offset = 0): Promise<ASICResponse> {
  const url = new URL('https://data.gov.au/data/api/3/action/datastore_search');
  const resourceId = 'c0129755-efab-4850-b73d-810c71a4bfd6'; // Credit Representative resource ID

  url.searchParams.append('resource_id', resourceId);
  url.searchParams.append('limit', limit.toString());
  url.searchParams.append('offset', offset.toString());

  console.log('Fetching credit representative data...');
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

  return data;
}

function transformRecord(record: ASICResponse['result']['records'][0]): NewCreditRepresentative {
  const edrs = edrsTypes.includes(record.CRED_REP_EDRS as typeof edrsTypes[number])
    ? record.CRED_REP_EDRS as typeof edrsTypes[number]
    : null;

  const authorizations = authorizationTypes.includes(record.CRED_REP_AUTHORISATIONS as typeof authorizationTypes[number])
    ? record.CRED_REP_AUTHORISATIONS as typeof authorizationTypes[number]
    : null;

  return {
    REGISTER_NAME: record.REGISTER_NAME,
    CRED_REP_NUM: String(record.CRED_REP_NUM),
    CRED_LIC_NUM: String(record.CRED_LIC_NUM),
    CRED_REP_NAME: record.CRED_REP_NAME,
    CRED_REP_ABN_ACN: record.CRED_REP_ABN_ACN ? String(record.CRED_REP_ABN_ACN) : null,
    CRED_REP_START_DT: record.CRED_REP_START_DT,
    CRED_REP_END_DT: record.CRED_REP_END_DT,
    CRED_REP_LOCALITY: record.CRED_REP_LOCALITY,
    CRED_REP_STATE: record.CRED_REP_STATE,
    CRED_REP_PCODE: record.CRED_REP_PCODE ? String(record.CRED_REP_PCODE) : null,
    CRED_REP_EDRS: edrs,
    CRED_REP_AUTHORISATIONS: authorizations,
    CRED_REP_CROSS_ENDORSE: record.CRED_REP_CROSS_ENDORSE
  };
}

async function importCreditRepresentativeData(sampleSize = 10) {
  try {
    console.log(`Starting Credit Representative data import (sample size: ${sampleSize})...`);
    const response = await fetchCreditRepresentativeData(sampleSize);

    if (!response.success || !response.result.records.length) {
      console.log('No records found');
      return;
    }

    const records = response.result.records.map(transformRecord);

    console.log('\nValidating records...');
    const validatedRecords = records.map(record =>
      insertCreditRepresentativeSchema.parse(record)
    );

    console.log('\nAttempting to insert records...');
    const { error } = await supabase
      .from('credit_representatives')
      .upsert(validatedRecords, {
        onConflict: 'CRED_REP_NUM',
        ignoreDuplicates: true
      });

    if (error) {
      console.error('Insert error:', error);
      throw error;
    }

    console.log(`Successfully processed ${validatedRecords.length} records`);
  } catch (error) {
    console.error('Import failed:', error);
  }
}

async function main() {
  await importCreditRepresentativeData(10);
  process.exit(0);
}

main();
