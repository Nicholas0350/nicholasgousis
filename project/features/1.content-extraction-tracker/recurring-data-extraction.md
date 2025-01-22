# Recurring Data Extraction

## Overview
Automated data extraction runs on multiple schedules to ensure data freshness and new entrant detection.

## Scheduled Tasks

1. Full Data Refresh
```sql
-- Schedule full data refresh monthly
select cron.schedule(
  'full-data-refresh',
  '0 0 1 * *',  -- First day of each month
  $$
  select net.http_post(
    url := 'https://chybymkpkirlyskmmxaf.supabase.co/functions/v1/full-data-refresh',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer ${SUPABASE_SERVICE_ROLE_KEY}"}'::jsonb
  ) as request_id;
  $$
);
```

2. New Entrants Check
```sql
-- Schedule new entrants check daily
select cron.schedule(
  'new-entrants-check',
  '0 1 * * *',  -- Daily at 1 AM
  $$
  select net.http_post(
    url := 'https://chybymkpkirlyskmmxaf.supabase.co/functions/v1/new-entrants-check',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer ${SUPABASE_SERVICE_ROLE_KEY}"}'::jsonb
  ) as request_id;
  $$
);
```

3. Ban Updates Check
```sql
-- Schedule banned persons check every 6 hours
select cron.schedule(
  'ban-updates-check',
  '0 */6 * * *',  -- Every 6 hours
  $$
  select net.http_post(
    url := 'https://chybymkpkirlyskmmxaf.supabase.co/functions/v1/ban-updates-check',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer ${SUPABASE_SERVICE_ROLE_KEY}"}'::jsonb
  ) as request_id;
  $$
);
```

## New Entrants Detection

1. Detection Strategy:
```typescript
interface NewEntrantDetection {
  // Compare against last known state
  compareDatasets: (current: Dataset, previous: Dataset) => EntrantDiff;

  // Identify truly new entities vs reactivated
  validateNewEntrant: (entity: Entity) => Promise<ValidationResult>;

  // Track historical appearances
  trackEntityHistory: (entity: Entity) => Promise<void>;
}

interface EntrantDiff {
  newEntities: Entity[];
  reactivatedEntities: Entity[];
  deactivatedEntities: Entity[];
  modifiedEntities: Entity[];
}
```

2. Processing Pipeline:
```typescript
interface ProcessingPipeline {
  // Extract current dataset
  fetchCurrentData: () => Promise<Dataset>;

  // Load previous state
  loadPreviousState: () => Promise<Dataset>;

  // Process differences
  processDifferences: (diff: EntrantDiff) => Promise<void>;

  // Update state
  updateState: (newState: Dataset) => Promise<void>;
}
```

## Change Detection

1. Field-level Changes:
```typescript
interface ChangeDetection {
  // Compare field values
  compareFields: (old: Entity, new: Entity) => FieldChanges[];

  // Determine change significance
  assessChangeSignificance: (changes: FieldChanges[]) => ChangeSignificance;

  // Track change history
  recordChanges: (changes: FieldChanges[]) => Promise<void>;
}
```

2. Relationship Changes:
```typescript
interface RelationshipChanges {
  // Detect relationship modifications
  detectRelationshipChanges: (old: Entity, new: Entity) => RelationshipDiff;

  // Update relationship graph
  updateRelationships: (changes: RelationshipDiff) => Promise<void>;

  // Maintain historical relationships
  trackRelationshipHistory: (entity: Entity) => Promise<void>;
}
```

## Monitoring and Alerts

1. Task Monitoring:
```typescript
interface TaskMonitoring {
  // Monitor task execution
  trackExecution: (task: ScheduledTask) => Promise<ExecutionMetrics>;

  // Check task health
  checkTaskHealth: (metrics: ExecutionMetrics) => HealthStatus;

  // Alert on issues
  sendAlerts: (status: HealthStatus) => Promise<void>;
}
```

2. Data Quality Monitoring:
```typescript
interface QualityMonitoring {
  // Monitor data quality
  checkDataQuality: (dataset: Dataset) => QualityMetrics;

  // Track quality trends
  trackQualityTrends: (metrics: QualityMetrics) => Promise<void>;

  // Alert on quality issues
  alertQualityIssues: (issues: QualityIssue[]) => Promise<void>;
}
```

## Error Recovery

1. Task Recovery:
```typescript
interface TaskRecovery {
  // Retry failed tasks
  retryTask: (task: ScheduledTask) => Promise<void>;

  // Handle partial failures
  handlePartialFailure: (task: ScheduledTask) => Promise<void>;

  // Log recovery attempts
  logRecoveryAttempt: (attempt: RecoveryAttempt) => Promise<void>;
}
```

2. Data Recovery:
```typescript
interface DataRecovery {
  // Restore previous state
  restoreState: (timestamp: Date) => Promise<void>;

  // Validate restored data
  validateRestoredData: (data: Dataset) => Promise<ValidationResult>;

  // Log recovery operations
  logRecoveryOperation: (operation: RecoveryOperation) => Promise<void>;
}
```