import { createClient } from '@supabase/supabase-js';
import { Database } from '../../types/supabase';

const AFSL_DATASET_URL = 'https://data.gov.au/data/api/3/action/datastore_search';
const RESOURCE_ID = 'd98a113d-6b50-40e6-b65f-2612efc877f4';

const batchConfig = {
  batchSize: 100,
  concurrency: 3,
  retryAttempts: 3,
  timeoutMs: 30000
};

interface ASICRecord {
  REGISTER_NAME: string;
  AFS_LIC_NUM: string;
  AFS_LIC_NAME: string;
  AFS_LIC_ABN: string;
  AFS_LIC_ACN: string;
  AFS_LIC_START_DT: string;
  AFS_LIC_END_DT: string;
  AFS_LIC_STATUS: string;
  AFS_LIC_ADD_LOC: string;
  AFS_LIC_ADD_STATE: string;
  AFS_LIC_ADD_PCO: string;
  AFS_LIC_ADD_COU: string;
  AFS_LIC_PRIN_BUS: string;
  AFS_LIC_SERV_NAME: string;
  AFS_LIC_REMUN_TYP: string;
  AFS_LIC_EXT_DIS_RES: string;
}

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function fetchAFSLData() {
  try {
    console.log('Starting AFSL data fetch...');

    // Fetch data from data.gov.au
    const url = new URL(AFSL_DATASET_URL);
    url.searchParams.append('resource_id', RESOURCE_ID);

    const response = await fetch(url.toString());
    if (!response.ok) throw new Error('Failed to fetch AFSL data');

    const { result: { records } } = await response.json();

    // Process in batches
    for (let i = 0; i < records.length; i += batchConfig.batchSize) {
      const batch = records.slice(i, i + batchConfig.batchSize);

      // Transform batch
      const transformedBatch = batch.map((record: ASICRecord) => ({
        REGISTER_NAME: record.REGISTER_NAME,
        AFS_LIC_NUM: record.AFS_LIC_NUM,
        AFS_LIC_NAME: record.AFS_LIC_NAME,
        AFS_LIC_ABN: normalizeABN(record.AFS_LIC_ABN),
        AFS_LIC_ACN: record.AFS_LIC_ACN,
        AFS_LIC_START_DT: record.AFS_LIC_START_DT,
        AFS_LIC_END_DT: record.AFS_LIC_END_DT,
        AFS_LIC_STATUS: record.AFS_LIC_STATUS,
        AFS_LIC_ADD_LOC: record.AFS_LIC_ADD_LOC,
        AFS_LIC_ADD_STATE: record.AFS_LIC_ADD_STATE,
        AFS_LIC_ADD_PCO: record.AFS_LIC_ADD_PCO,
        AFS_LIC_ADD_COU: record.AFS_LIC_ADD_COU,
        AFS_LIC_PRIN_BUS: record.AFS_LIC_PRIN_BUS,
        AFS_LIC_SERV_NAME: record.AFS_LIC_SERV_NAME,
        AFS_LIC_REMUN_TYP: record.AFS_LIC_REMUN_TYP,
        AFS_LIC_EXT_DIS_RES: record.AFS_LIC_EXT_DIS_RES
      }));

      // Upsert to database
      const { error } = await supabase
        .from('afs_licensees')
        .upsert(transformedBatch, {
          onConflict: 'AFS_LIC_NUM',
          ignoreDuplicates: false
        });

      if (error) throw error;

      console.log(`Processed batch ${i / batchConfig.batchSize + 1}`);
    }

    console.log('AFSL data fetch completed successfully');
    return { success: true };

  } catch (error) {
    console.error('Error fetching AFSL data:', error);
    return { success: false, error };
  }
}

function normalizeABN(abn: string): string {
  return abn.replace(/[^0-9]/g, '');
}