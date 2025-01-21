# Social Post Generator

## Overview
A feature that converts various content types (PDF, Markdown, URLs) into optimized social media threads using Claude AI, with intelligent scheduling and growth analytics.

## Implementation Steps

### 1. Setup Dependencies
```bash
npm install @deepseek/deepseek-sdk langchain marked cheerio twitter-api-v2 @nivo/line @nivo/bar
```

### 2. Environment Configuration
- Add DEEPSEEK_API_KEY to .env
- Configure Twitter API credentials
- Setup Supabase connection

### 3. Core Components

#### Resource Processing
- Create types for Resource and ThreadSegment
- Implement handlers for PDF, Markdown, and URL content
- Add content extraction and cleaning utilities

#### AI Integration
- Setup DeepSeek
- Implement thread generation logic
- Add content optimization prompts
- Handle rate limits and errors

#### Analytics & Growth Tracking
- Setup analytics tables in Supabase
  - account_metrics
  - post_performance
  - growth_targets
- Implement growth prediction algorithms
- Track engagement metrics
- Monitor posting effectiveness

#### Cadence Scheduler
- Analyze optimal posting times
- Track account growth rates
- Generate posting schedules
- Adjust frequency based on performance
- Monitor target vs actual growth

### 4. API Routes

#### POST /api/generate-thread
- Accept multiple resource types
- Process content through handlers
- Generate thread using Claude
- Store results in database

#### POST /api/schedule-thread
- Accept thread and scheduling parameters
- Validate scheduling time
- Update thread status

#### POST /api/optimize-schedule
- Analyze account metrics
- Calculate growth predictions
- Generate optimal posting times
- Return recommended schedule

### 5. UI Components

#### Resource Upload
```typescript
// components/ResourceUpload.tsx
- File upload for PDFs
- URL input field
- Markdown editor
- Resource preview
```

#### Thread Preview
```typescript
// components/ThreadPreview.tsx
- Display generated thread segments
- Allow manual editing
- Show character count
- Media attachment support
```

#### Growth Monitor
```typescript
// components/GrowthMonitor.tsx
- Display current vs predicted growth
- Show engagement metrics
- Visualize posting performance
- List recommended actions
```

#### Analytics Dashboard
```typescript
// components/AnalyticsDashboard.tsx
- Growth rate charts
- Engagement metrics
- Best performing content types
- Optimal posting times
```

### 6. Database Schema

#### Analytics Tables
```sql
- account_metrics (follower growth, engagement)
- post_performance (impressions, engagement)
- growth_targets (goals, predictions)
```

### 7. Scheduler Features
- Dynamic frequency adjustment
- Performance-based timing
- A/B testing of posting times
- Growth rate monitoring
- Target tracking
- Schedule optimization

### 8. Monitoring & Analytics
- Track API usage
- Monitor thread performance
- Growth prediction accuracy
- Engagement patterns
- Content performance
- Schedule effectiveness

### 9. Future Enhancements
- AI-powered content optimization
- Automated A/B testing
- Multi-platform analytics
- Advanced growth predictions
- Competitor analysis
- Custom scheduling rules
- Performance alerts

## API Reference

### Generate Thread
```typescript
POST /api/generate-thread
Body: {
  resources: Resource[]
}
Response: {
  thread: ThreadSegment[]
}
```

### Optimize Schedule
```typescript
POST /api/optimize-schedule
Body: {
  userId: string
}
Response: {
  growth: GrowthPrediction
  schedule: {
    time: number
    frequency: number
    expectedEngagement: number
  }[]
}
```

### Update Metrics
```typescript
POST /api/update-metrics
Body: {
  userId: string
  metrics: AccountMetrics
}
```

## Usage Limits
- Max 5 resources per request
- Max 100 requests per hour
- Max thread length: 25 tweets
- Max file size: 10MB
- Analytics retention: 90 days
- Max scheduling frequency: 4 posts/day
