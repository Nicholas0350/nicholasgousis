import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import type { NewBannedPerson } from '../../src/db/schema/banned_and_disqualified_persons';
import { bdPersonTypes } from '../../src/db/schema/banned_and_disqualified_persons';

config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface BannedPersonResponse {
  success: boolean;
  result: {
    records: Array<{
      REGISTER_NAME: string;
      BD_PER_NAME: string;
      BD_PER_TYPE: typeof bdPersonTypes[number];
      BD_PER_DOC_NUM: string;
      BD_PER_START_DT: string;
      BD_PER_END_DT: string | null;
      BD_PER_ADD_LOCAL: string;
      BD_PER_ADD_STATE: string;
      BD_PER_ADD_PCODE: string;
      BD_PER_ADD_COUNTRY: string;
      BD_PER_COMMENTS: string | null;
    }>;
  };
}

async function fetchBannedPersonData(limit = 10, offset = 0): Promise<BannedPersonResponse> {
  const url = new URL('https://data.gov.au/data/api/3/action/datastore_search_sql');

  const sqlQuery = `
    SELECT *
    FROM "741da9e3-7e0c-458e-830c-c518698e1788"
    WHERE "REGISTER_NAME" LIKE '%Banned%' OR "REGISTER_NAME" LIKE '%Disqualified%'
    LIMIT ${limit}
    OFFSET ${offset}
  `;

  url.searchParams.append('sql', sqlQuery);

  console.log('Fetching from:', url.toString());
  console.log('SQL Query:', sqlQuery);

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  console.log('\nFirst record sample:', JSON.stringify(data.result.records[0], null, 2));

  return data;
}

function parseDate(dateStr: string): Date {
  if (!dateStr) {
    // Return a default date if string is empty
    return new Date('1970-01-01');
  }
  // Convert DD/MM/YYYY to YYYY-MM-DD for proper Date parsing
  const [day, month, year] = dateStr.split('/');
  const date = new Date(`${year}-${month}-${day}`);

  // Return default date if parsing failed
  return isNaN(date.getTime()) ? new Date('1970-01-01') : date;
}

function transformRecord(record: BannedPersonResponse['result']['records'][0]): NewBannedPerson {
  return {
    REGISTER_NAME: record.REGISTER_NAME,
    BD_PER_NAME: record.BD_PER_NAME,
    BD_PER_TYPE: record.BD_PER_TYPE,
    BD_PER_DOC_NUM: record.BD_PER_DOC_NUM,
    BD_PER_START_DT: parseDate(record.BD_PER_START_DT),
    BD_PER_END_DT: record.BD_PER_END_DT ? parseDate(record.BD_PER_END_DT) : parseDate('01/01/1970'),
    BD_PER_ADD_LOCAL: record.BD_PER_ADD_LOCAL?.trim() || 'ADDRESS UNKNOWN',
    BD_PER_ADD_STATE: record.BD_PER_ADD_STATE?.trim() || 'ADDRESS UNKNOWN',
    BD_PER_ADD_PCODE: record.BD_PER_ADD_PCODE?.trim() || 'ADDRESS UNKNOWN',
    BD_PER_ADD_COUNTRY: record.BD_PER_ADD_COUNTRY?.trim() || 'AUSTRALIA',
    BD_PER_COMMENTS: record.BD_PER_COMMENTS?.trim() || null,
  };
}

async function importBannedPersonData(sampleSize = 10) {
  try {
    console.log(`Fetching ${sampleSize} record(s)...`);

    const response = await fetchBannedPersonData(sampleSize, 0);
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
        .from('banned_and_disqualified_persons')
        .upsert([transformedRecord], {
          onConflict: 'BD_PER_DOC_NUM',
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
importBannedPersonData(1);