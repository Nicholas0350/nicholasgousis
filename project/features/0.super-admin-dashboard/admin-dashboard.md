# Super Admin Dashboard

## Overview
The admin dashboard provides a comprehensive interface for managing content strategy on nicholasgousis.com. It features:

- Content Management
  - Media releases table with filtering and sorting
  - Regulatory tracker with impact analysis
  - Content performance analytics

- AI-Powered Content Generation
  - OpenAI/Grok/Deepseek integration for content analysis
  - Automated article drafting based on licensee permissions
  - Content collection management per licensee

- Social Media Integration
  - Twitter thread generation
  - LinkedIn post creation
  - Newsletter content management

## Implementation

### Core Components

1. Content Management Tab
   - DataTable for media releases
   - DataTable for regulatory releases
   - Filtering and sorting capabilities

2. Analytics Tab
   - Content performance metrics
   - Distribution charts
   - Engagement analytics

3. Licensee Impact Tab
   - Impact analysis per licensee
   - Article association tracking
   - Permission-based content filtering

4. Article Drafts Tab
   - AI-generated draft management
   - Review and approval workflow
   - Multi-platform content preview

### Data Structure

```typescript
interface MediaRelease {
  id: string
  title: string
  source: string
  publishedAt: string
  status: 'pending' | 'processed' | 'published'
}

interface RegulatoryRelease {
  id: string
  title: string
  type: string
  releaseDate: string
  impact: 'high' | 'medium' | 'low'
}

interface ArticleDraft {
  id: string
  title: string
  licensee: string
  status: 'draft' | 'review' | 'approved'
  createdAt: string
}
```

### API Endpoints

- GET /api/media-releases
- GET /api/regulatory-releases
- GET /api/analytics/content
- GET /api/licensee-impact
- GET /api/article-drafts

### Dependencies

- @tanstack/react-query for data fetching
- recharts for analytics visualization
- shadcn/ui components
- OpenAI/Grok/Deepseek API integration

### Setup Steps

1. Install dependencies:
```bash
npm install @tanstack/react-query recharts
```

2. Configure API routes in app/api directory

3. Set up environment variables:
```env
OPENAI_API_KEY=
GROK_API_KEY=
DEEPSEEK_API_KEY=
```

4. Initialize React Query client in layout.tsx
