import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { Database } from '../../types/supabase';

config();

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const FINANCIAL_ADVISERS_DATASET_URL = 'https://data.gov.au/dataset/asic-financial-advisers-register';

interface FinancialAdviserResponse {
  result: {
    records: Array<{
      REGISTER_NAME: string
      ADV_NAME: string
      ADV_NUMBER: string
      ADV_ROLE: string
      ADV_SUB_TYPE: string | null
      ADV_ROLE_STATUS: string
      ADV_ABN: string | null
      ADV_FIRST_PROVIDED_ADVICE: string | null
      ADV_START_DT: string
      ADV_END_DT: string | null
      ADV_DA_START_DT: string | null
      ADV_DA_END_DT: string | null
      ADV_DA_TYPE: string | null
      ADV_DA_DESCRIPTION: string | null
      ADV_CPD_FAILURE_YEAR: string | null
      ADV_ADD_LOCAL: string | null
      ADV_ADD_STATE: string | null
      ADV_ADD_PCODE: string | null
      ADV_ADD_COUNTRY: string | null
      LICENCE_NAME: string
      LICENCE_NUMBER: string
      LICENCE_ABN: string | null
      LICENCE_CONTROLLED_BY: string | null
      REP_APPOINTED_BY: string | null
      REP_APPOINTED_NUM: string | null
      REP_APPOINTED_ABN: string | null
      OVERALL_REGISTRATION_STATUS: string
      REGISTRATION_STATUS_UNDER_AFSL: string
      REGISTRATION_START_DATE_UNDER_AFSL: string | null
      REGISTRATION_END_DATE_UNDER_AFSL: string | null
      QUALIFICATIONS_AND_TRAINING: string | null
      MEMBERSHIPS: string | null
      FURTHER_RESTRICTIONS: string | null
      ABLE_TO_PROVIDE_TFAS: string | null
      FIN: string | null
      FIN_CARBUNIT: string | null
      FIN_DEPPAY_DPNONBAS: string | null
      FIN_DEPPAY_DPNONCSH: string | null
      FIN_DERIV: string | null
      FIN_DERIV_DERWOOL: string | null
      FIN_DERIV_DERELEC: string | null
      FIN_DERIV_DERGRAIN: string | null
      FIN_FOREXCH: string | null
      FIN_GOVDEB: string | null
      FIN_LIFEPROD_LIFEINV: string | null
      FIN_LIFEPROD_LIFERISK: string | null
      FIN_LIFEPROD_LIFERISK_LIFECONS: string | null
      FIN_MINV_MIEXCLUDEIDPS: string | null
      FIN_MINV_MIINCLUDEIDPS: string | null
      FIN_MINV_MIIDPSONLY: string | null
      FIN_MINV_MIOWN: string | null
      FIN_MINV_MIHORSE: string | null
      FIN_MINV_MITIME: string | null
      FIN_MINV_IMIS: string | null
      FIN_RSA: string | null
      FIN_SECUR: string | null
      FIN_SUPER: string | null
      FIN_SUPER_SMSUPER: string | null
      FIN_SUPER_SUPERHOLD: string | null
      FIN_STDMARGLEND: string | null
      FIN_NONSTDMARGLEND: string | null
      FIN_AUSCARBCRDUNIT: string | null
      FIN_ELIGINTREMSUNIT: string | null
      FIN_MISFIN_MISMDA: string | null
      FIN_MISFIN_MISFINRP: string | null
      FIN_MISFIN_MISFINIP: string | null
      FIN_FHSANONADIDUMMY: string | null
      CLASSES_SECUR: string | null
      CLASSES_SMIS: string | null
      CLASSES_LIFEPROD_LIFERISK: string | null
      CLASSES_SUPER: string | null
    }>
  }
}

export async function fetchFinancialAdvisersData(sampleSize = 10, offset = 0): Promise<{ success: true; result: FinancialAdviserResponse } | { success: false; error: unknown }> {
  try {
    console.log('Starting Financial Advisers data fetch...');

    const url = new URL(FINANCIAL_ADVISERS_DATASET_URL);
    url.searchParams.append('limit', sampleSize.toString());
    url.searchParams.append('offset', offset.toString());

    const response = await fetch(url.toString());
    if (!response.ok) throw new Error('Failed to fetch Financial Advisers data');

    const data = await response.json() as FinancialAdviserResponse;
    return { success: true, result: data };

  } catch (error) {
    console.error('Error fetching Financial Advisers data:', error);
    return { success: false, error };
  }
}

export async function getAFSLLicenseeDetails(licenseNumber: string) {
  const { data, error } = await supabase
    .from('afsl_licensees')
    .select('*')
    .eq('license_number', licenseNumber)
    .single();

  if (error) {
    console.error('Error fetching AFSL licensee:', error);
    return null;
  }

  return data;
}

function transformRecord(record: FinancialAdviserResponse['result']['records'][0]) {
  return {
    REGISTER_NAME: record.REGISTER_NAME,
    ADV_NAME: record.ADV_NAME,
    ADV_NUMBER: record.ADV_NUMBER,
    ADV_ROLE: record.ADV_ROLE,
    ADV_SUB_TYPE: record.ADV_SUB_TYPE || null,
    ADV_ROLE_STATUS: record.ADV_ROLE_STATUS,
    ADV_ABN: record.ADV_ABN || null,
    ADV_FIRST_PROVIDED_ADVICE: record.ADV_FIRST_PROVIDED_ADVICE || null,
    ADV_DA_START_DT: record.ADV_DA_START_DT || null,
    ADV_DA_END_DT: record.ADV_DA_END_DT || null,
    ADV_DA_TYPE: record.ADV_DA_TYPE || null,
    ADV_DA_DESCRIPTION: record.ADV_DA_DESCRIPTION || null,
    ADV_START_DT: record.ADV_START_DT,
    ADV_END_DT: record.ADV_END_DT || null,
    ADV_CPD_FAILURE_YEAR: record.ADV_CPD_FAILURE_YEAR || null,
    ADV_ADD_LOCAL: record.ADV_ADD_LOCAL || null,
    ADV_ADD_STATE: record.ADV_ADD_STATE || null,
    ADV_ADD_PCODE: record.ADV_ADD_PCODE || null,
    ADV_ADD_COUNTRY: record.ADV_ADD_COUNTRY || null,
    LICENCE_NAME: record.LICENCE_NAME,
    LICENCE_NUMBER: record.LICENCE_NUMBER,
    LICENCE_ABN: record.LICENCE_ABN || null,
    LICENCE_CONTROLLED_BY: record.LICENCE_CONTROLLED_BY || null,
    REP_APPOINTED_BY: record.REP_APPOINTED_BY || null,
    REP_APPOINTED_NUM: record.REP_APPOINTED_NUM || null,
    REP_APPOINTED_ABN: record.REP_APPOINTED_ABN || null,
    OVERALL_REGISTRATION_STATUS: record.OVERALL_REGISTRATION_STATUS || null,
    REGISTRATION_STATUS_UNDER_AFSL: record.REGISTRATION_STATUS_UNDER_AFSL || null,
    REGISTRATION_START_DATE_UNDER_AFSL: record.REGISTRATION_START_DATE_UNDER_AFSL || null,
    REGISTRATION_END_DATE_UNDER_AFSL: record.REGISTRATION_END_DATE_UNDER_AFSL || null,
    QUALIFICATIONS_AND_TRAINING: record.QUALIFICATIONS_AND_TRAINING || null,
    MEMBERSHIPS: record.MEMBERSHIPS || null,
    FURTHER_RESTRICTIONS: record.FURTHER_RESTRICTIONS || null,
    ABLE_TO_PROVIDE_TFAS: record.ABLE_TO_PROVIDE_TFAS || null,
    // Financial Product Authorizations
    FIN: record.FIN || '0',
    FIN_CARBUNIT: record.FIN_CARBUNIT || '0',
    FIN_DEPPAY_DPNONBAS: record.FIN_DEPPAY_DPNONBAS || '0',
    FIN_DEPPAY_DPNONCSH: record.FIN_DEPPAY_DPNONCSH || '0',
    FIN_DERIV: record.FIN_DERIV || '0',
    FIN_DERIV_DERWOOL: record.FIN_DERIV_DERWOOL || '0',
    FIN_DERIV_DERELEC: record.FIN_DERIV_DERELEC || '0',
    FIN_DERIV_DERGRAIN: record.FIN_DERIV_DERGRAIN || '0',
    FIN_FOREXCH: record.FIN_FOREXCH || '0',
    FIN_GOVDEB: record.FIN_GOVDEB || '0',
    FIN_LIFEPROD_LIFEINV: record.FIN_LIFEPROD_LIFEINV || '0',
    FIN_LIFEPROD_LIFERISK: record.FIN_LIFEPROD_LIFERISK || '0',
    FIN_LIFEPROD_LIFERISK_LIFECONS: record.FIN_LIFEPROD_LIFERISK_LIFECONS || '0',
    FIN_MINV_MIEXCLUDEIDPS: record.FIN_MINV_MIEXCLUDEIDPS || '0',
    FIN_MINV_MIINCLUDEIDPS: record.FIN_MINV_MIINCLUDEIDPS || '0',
    FIN_MINV_MIIDPSONLY: record.FIN_MINV_MIIDPSONLY || '0',
    FIN_MINV_MIOWN: record.FIN_MINV_MIOWN || '0',
    FIN_MINV_MIHORSE: record.FIN_MINV_MIHORSE || '0',
    FIN_MINV_MITIME: record.FIN_MINV_MITIME || '0',
    FIN_MINV_IMIS: record.FIN_MINV_IMIS || '0',
    FIN_RSA: record.FIN_RSA || '0',
    FIN_SECUR: record.FIN_SECUR || '0',
    FIN_SUPER: record.FIN_SUPER || '0',
    FIN_SUPER_SMSUPER: record.FIN_SUPER_SMSUPER || '0',
    FIN_SUPER_SUPERHOLD: record.FIN_SUPER_SUPERHOLD || '0',
    FIN_STDMARGLEND: record.FIN_STDMARGLEND || '0',
    FIN_NONSTDMARGLEND: record.FIN_NONSTDMARGLEND || '0',
    FIN_AUSCARBCRDUNIT: record.FIN_AUSCARBCRDUNIT || '0',
    FIN_ELIGINTREMSUNIT: record.FIN_ELIGINTREMSUNIT || '0',
    FIN_MISFIN_MISMDA: record.FIN_MISFIN_MISMDA || '0',
    FIN_MISFIN_MISFINRP: record.FIN_MISFIN_MISFINRP || '0',
    FIN_MISFIN_MISFINIP: record.FIN_MISFIN_MISFINIP || '0',
    FIN_FHSANONADIDUMMY: record.FIN_FHSANONADIDUMMY || '0',
    // Class of Product Advice
    CLASSES_SECUR: record.CLASSES_SECUR || '0',
    CLASSES_SMIS: record.CLASSES_SMIS || '0',
    CLASSES_LIFEPROD_LIFERISK: record.CLASSES_LIFEPROD_LIFERISK || '0',
    CLASSES_SUPER: record.CLASSES_SUPER || '0',
  };
}

export async function importFinancialAdviserData(sampleSize = 10) {
  try {
    console.log(`Fetching ${sampleSize} record(s)...`);

    const response = await fetchFinancialAdvisersData(sampleSize, 0);
    if (!response.success) {
      throw response.error;
    }

    const { records } = response.result.result;

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
        .from('financial_advisers')
        .upsert([transformedRecord], {
          onConflict: 'ADV_NUMBER',
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
importFinancialAdviserData(1);