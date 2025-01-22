# Data.gov.au Extraction Pipeline

## Overview
The pipeline extracts data from data.gov.au for:
- AFS Licensees
- Credit Licensees
- Financial Advisers
- Credit Representatives
- Banned Persons

## Data Sources

1. AFS Data:
   - Professional Registers: https://data.gov.au/dataset/asic-financial-services-dataset
   - Banned Persons: https://data.gov.au/dataset/banned-and-disqualified-persons-register

2. Credit Data:
   - Credit Registers: https://data.gov.au/dataset/asic-credit-dataset
   - Credit Representatives: https://data.gov.au/dataset/credit-representative-register

## Implementation Steps

1. Initial Data Import
   ```typescript
   interface ExtractorConfig {
     datasetUrl: string;
     entityType: 'afs' | 'credit' | 'banned' | 'adviser' | 'representative';
     transformers: DataTransformer[];
     validators: DataValidator[];
   }
   ```

2. Data Transformation Pipeline
   - Raw data validation
   - Schema mapping
   - Data cleaning
   - Relationship mapping
   - Duplicate detection
   - Error handling

3. Data Quality Checks
   - Field validation
   - Relationship validation
   - Historical data preservation
   - Change detection
   - Error logging

4. Database Operations
   - Upsert strategies
   - Relationship maintenance
   - Historical tracking
   - Index management
   - Performance optimization

## Data Transformation Rules

1. AFS Licensees:
   ```typescript
   interface AFSLicenseeTransform {
     normalizeABN: (abn: string) => string;
     validateLicenseNumber: (num: string) => boolean;
     mapServiceTypes: (services: string[]) => string[];
     cleanAddressData: (address: any) => Address;
   }
   ```

2. Credit Representatives:
   ```typescript
   interface CreditRepTransform {
     normalizeRepNumber: (num: string) => string;
     validateEDRS: (edrs: string) => boolean;
     mapAuthorizations: (auths: string[]) => string[];
     linkToLicensee: (licNum: string) => Promise<boolean>;
   }
   ```

3. Banned Persons:
   ```typescript
   interface BannedPersonTransform {
     normalizeName: (name: string) => string;
     validateBanPeriod: (start: Date, end: Date) => boolean;
     mapBanTypes: (types: string[]) => string[];
     linkToEntities: (relationships: any[]) => Promise<void>;
   }
   ```

## Error Handling

1. Data Validation Errors:
   ```typescript
   interface ValidationError {
     entityType: string;
     recordId: string;
     field: string;
     error: string;
     severity: 'warning' | 'error' | 'critical';
   }
   ```

2. Error Recovery:
   - Retry strategies
   - Partial updates
   - Error logging
   - Alert notifications
   - Manual review queues

## Performance Optimization

1. Batch Processing:
   ```typescript
   interface BatchConfig {
     batchSize: number;
     concurrency: number;
     retryAttempts: number;
     timeoutMs: number;
   }
   ```

2. Resource Management:
   - Connection pooling
   - Memory management
   - CPU utilization
   - Network optimization
   - Disk I/O management

## Monitoring

1. Extraction Metrics:
   - Records processed
   - Processing time
   - Error rates
   - Data quality scores
   - System resource usage

2. Alert Conditions:
   - Processing failures
   - Data quality issues
   - Performance degradation
   - Resource exhaustion
   - System errors

## Database Indexes

```sql
-- AFS Licensees
CREATE INDEX idx_afs_license_number ON afs_licensees(afs_lic_num);
CREATE INDEX idx_afs_abn_acn ON afs_licensees(afs_lic_abn, afs_lic_acn);
CREATE INDEX idx_afs_status ON afs_licensees(afs_lic_status);

-- Credit Representatives
CREATE INDEX idx_credit_rep_number ON credit_representatives(cred_rep_num);
CREATE INDEX idx_credit_licensee ON credit_representatives(cred_lic_num);
CREATE INDEX idx_credit_rep_status ON credit_representatives(status);

-- Banned Persons
CREATE INDEX idx_banned_type ON banned_and_disqualified_persons(bd_per_type);
CREATE INDEX idx_banned_dates ON banned_and_disqualified_persons(bd_per_start_dt, bd_per_end_dt);
```

## Integration Points

1. Data Pipeline:
   - Supabase Functions
   - Edge Functions
   - Scheduled Tasks
   - Error Handlers
   - Monitoring Systems

2. External Systems:
   - ABN Lookup
   - Address Validation
   - Geocoding Services
   - Document Storage
   - Notification Systems

# AFSL Data Pipeline


Details:

Data is fetched from data.gov.au
Parsed and transformed so it can be upserted into Supabase
Data is fetched on the 1st and 15th of each month


## Cron for data pipeline
```sql
-- Schedule AFSL data fetch to run on 1st and 15th of each month at 00:00 UTC
select cron.schedule(
  'fetch-afsl-data',
  '0 0 1,15 * *',
  $$
  select net.http_post(
    url := 'https://chybymkpkirlyskmmxaf.supabase.co/functions/v1/fetch-afsl-data',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNoeWJ5bWtwa2lybHlza21teGFmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxNTQxOTM3NywiZXhwIjoyMDMwOTk1Mzc3fQ._X1ldeh1SHu_besmPY6tbVPckVanZA9-ox-UBAJxpCk"}'::jsonb
  ) as request_id;
  $$
);
```

## Supabase

-- Create index for faster searches
  -- create index
  -- create index

<!-- -- Prospects Table (for sales pipeline)
create table public.prospects (
  id bigint primary key,
  afsl_licensee_id bigint references public.afsl_licensees(id),
  status varchar default 'new',
  priority int default 0,
  last_contacted timestamptz,
  next_follow_up timestamptz,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create index for pipeline management
create index idx_prospects_status on public.prospects(status);
create index idx_prospects_next_follow_up on public.prospects(next_follow_up); -->


## Implementation Steps

1. Data Import Script
   - Create TypeScript interfaces for AFSL data
   - Implement API fetching with rate limiting
   - Transform data to match Supabase schema
   - Implement upsert logic for updates

2. Data Enrichment
   - Company size from ABN lookup
   - LinkedIn company profiles
   - Website details
   - Industry categorization

3. Prospect Scoring
   - Score based on:
     * License scope
     * Company size
     * Location
     * Recent compliance issues
     * Digital presence

4. Integration Points
