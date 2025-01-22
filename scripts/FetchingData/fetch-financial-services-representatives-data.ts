import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import type { NewFinancialServicesRep } from '../../src/db/schema/financial_services_representatives';

config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface FinancialServicesRepResponse {
  success: boolean;
  result: {
    records: Array<{
      REGISTER_NAME: string;
      AFS_REP_NUM: string;
      AFS_LIC_NUM: string;
      AFS_REP_NAME: string;
      AFS_REP_ABN: string | null;
      AFS_REP_ACN: string | null;
      AFS_REP_OTHER_ROLE: string | null;
      AFS_REP_START_DT: string;
      AFS_REP_STATUS: string;
      AFS_REP_END_DT: string | null;
      AFS_REP_ADD_LOCAL: string | null;
      AFS_REP_ADD_STATE: string | null;
      AFS_REP_ADD_PCODE: string | null;
      AFS_REP_ADD_COUNTRY: string | null;
      AFS_REP_CROSS_ENDORSE: string | null;
      AFS_REP_MAY_APPOINT: string | null;
      AFS_REP_APPOINTED_BY: string | null;
      FIN: string;
      DEAL: string;
      APPLY: string;
      GENFIN: string;
      ISSUE: string;
      ARRANGE_APPLY: string;
      ARRANGE_ISSUE: string;
      ARRANGE_UNDERWR: string;
      CLASSES: string;
      DEAL_APPLY: string;
      DEAL_ISSUE: string;
      DEAL_UNDERWR: string;
      IDPS: string;
      MARKET: string;
      NONIDPS: string;
      SCHEME: string;
      TRUSTEE: string;
      WSALE: string;
      ARRANGE: string;
      UNDERWR: string;
      AFS_REP_SAME_AUTH: string | null;
      AFS_REP_RELATED_BN: string | null;
    }>;
  };
}

function parseDate(dateStr: string): Date {
  if (!dateStr) {
    return new Date('1970-01-01');
  }
  const [day, month, year] = dateStr.split('/');
  const date = new Date(`${year}-${month}-${day}`);
  return isNaN(date.getTime()) ? new Date('1970-01-01') : date;
}

async function fetchFinancialServicesRepData(limit = 100, offset = 0): Promise<FinancialServicesRepResponse> {
  const url = new URL('https://data.gov.au/data/api/3/action/datastore_search');
  url.searchParams.append('resource_id', '5515dfcc-5266-44df-950d-7e359a83d514');
  url.searchParams.append('limit', limit.toString());
  url.searchParams.append('offset', offset.toString());

  console.log('Fetching from:', url.toString());

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  console.log('\nFirst record sample:', JSON.stringify(data.result.records[0], null, 2));

  return data;
}

function transformRecord(record: FinancialServicesRepResponse['result']['records'][0]): NewFinancialServicesRep {
  return {
    REGISTER_NAME: record.REGISTER_NAME,
    AFS_REP_NUM: record.AFS_REP_NUM,
    AFS_LIC_NUM: record.AFS_LIC_NUM,
    AFS_REP_NAME: record.AFS_REP_NAME,
    AFS_REP_ABN: record.AFS_REP_ABN,
    AFS_REP_ACN: record.AFS_REP_ACN,
    AFS_REP_OTHER_ROLE: record.AFS_REP_OTHER_ROLE,
    AFS_REP_START_DT: parseDate(record.AFS_REP_START_DT),
    AFS_REP_STATUS: record.AFS_REP_STATUS,
    AFS_REP_END_DT: record.AFS_REP_END_DT ? parseDate(record.AFS_REP_END_DT) : null,
    AFS_REP_ADD_LOCAL: record.AFS_REP_ADD_LOCAL?.trim() || null,
    AFS_REP_ADD_STATE: record.AFS_REP_ADD_STATE?.trim() || null,
    AFS_REP_ADD_PCODE: record.AFS_REP_ADD_PCODE?.trim() || null,
    AFS_REP_ADD_COUNTRY: record.AFS_REP_ADD_COUNTRY?.trim() || null,
    AFS_REP_CROSS_ENDORSE: record.AFS_REP_CROSS_ENDORSE?.trim() || null,
    AFS_REP_MAY_APPOINT: record.AFS_REP_MAY_APPOINT?.trim() || null,
    AFS_REP_APPOINTED_BY: record.AFS_REP_APPOINTED_BY?.trim() || null,
    // Financial Product Authorizations
    FIN: record.FIN || '0',
    DEAL: record.DEAL || '0',
    APPLY: record.APPLY || '0',
    GENFIN: record.GENFIN || '0',
    ISSUE: record.ISSUE || '0',
    ARRANGE_APPLY: record.ARRANGE_APPLY || '0',
    ARRANGE_ISSUE: record.ARRANGE_ISSUE || '0',
    ARRANGE_UNDERWR: record.ARRANGE_UNDERWR || '0',
    CLASSES: record.CLASSES || '0',
    DEAL_APPLY: record.DEAL_APPLY || '0',
    DEAL_ISSUE: record.DEAL_ISSUE || '0',
    DEAL_UNDERWR: record.DEAL_UNDERWR || '0',
    IDPS: record.IDPS || '0',
    MARKET: record.MARKET || '0',
    NONIDPS: record.NONIDPS || '0',
    SCHEME: record.SCHEME || '0',
    TRUSTEE: record.TRUSTEE || '0',
    WSALE: record.WSALE || '0',
    ARRANGE: record.ARRANGE || '0',
    UNDERWR: record.UNDERWR || '0',
    AFS_REP_SAME_AUTH: record.AFS_REP_SAME_AUTH?.trim() || null,
    AFS_REP_RELATED_BN: record.AFS_REP_RELATED_BN?.trim() || null,
  };
}

async function importFinancialServicesRepData(sampleSize = 10) {
  try {
    console.log(`Fetching ${sampleSize} record(s)...`);

    const response = await fetchFinancialServicesRepData(sampleSize, 0);
    const records = response.result.records;

    if (records.length === 0) {
      console.log('No records found');
      return { success: true, recordsProcessed: 0 };
    }

    console.log(`Processing ${records.length} record(s)...`);

    let totalProcessed = 0;
    for (const record of records) {
      const transformedRecord = transformRecord(record);
      console.log('Attempting to insert transformed record:', transformedRecord);

      const { data, error } = await supabase
        .from('financial_services_representatives')
        .upsert([transformedRecord], {
          onConflict: 'AFS_REP_NUM',
          ignoreDuplicates: false,
        });

      if (error) {
        console.error('Error inserting record:', {
          error,
          details: error.details,
          message: error.message,
          hint: error.hint
        });
        continue;
      } else {
        console.log('Successfully inserted record:', data);
        totalProcessed++;
      }
    }

    console.log(`Total processed: ${totalProcessed}`);
    console.log('Import completed successfully!');
    return { success: true, recordsProcessed: totalProcessed };
  } catch (error) {
    console.error('Error importing data:', error);
    return { success: false, error };
  }
}

// Import 1 record
importFinancialServicesRepData(100);