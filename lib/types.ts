export interface Resource {
  type: 'pdf' | 'markdown' | 'url';
  content: string;
  metadata?: {
    title?: string;
    author?: string;
    date?: string;
  };
}

export interface ThreadSegment {
  text: string;
  position: number;
  total: number;
  media?: string[];
}

export interface AccountMetrics {
  followersCount: number;
  engagementRate: number;
  postFrequency: number;
  bestPostingTimes: {
    day: string;
    hours: number[];
  }[];
}

export interface PostPerformance {
  impressions: number;
  likes: number;
  replies: number;
  reposts: number;
  engagementRate: number;
  posted_at?: string;
}

export interface GrowthPrediction {
  metric: string;
  currentValue: number[];
  predictedValue: number[];
  confidence: number;
  recommendedActions: RecommendedAction[];
}

export interface RecommendedAction {
  action: string;
  impact: number;
}