interface Resource {
  type: 'pdf' | 'markdown' | 'url';
  content: string;
  metadata?: {
    title?: string;
    author?: string;
    date?: string;
  };
}

interface ThreadSegment {
  text: string;
  position: number;
  total: number;
  media?: string[];
}

interface AccountMetrics {
  followersCount: number;
  engagementRate: number;
  postFrequency: number;
  bestPostingTimes: {
    day: string;
    hours: number[];
  }[];
}

interface PostPerformance {
  impressions: number;
  likes: number;
  replies: number;
  reposts: number;
  engagementRate: number;
}

interface GrowthPrediction {
  metric: string;
  currentValue: number;
  predictedValue: number;
  confidence: number;
  recommendedActions: {
    action: string;
    impact: number;
  }[];
}