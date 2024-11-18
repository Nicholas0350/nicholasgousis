import { supabase } from './supabase';
import { AccountMetrics, PostPerformance, GrowthPrediction } from './types';

export class CadenceScheduler {
  private readonly MIN_POSTS_PER_WEEK = 3;
  private readonly MAX_POSTS_PER_DAY = 4;

  async analyzeGrowthRate(userId: string): Promise<GrowthPrediction> {
    // Get historical metrics
    const { data: metrics } = await supabase
      .from('account_metrics')
      .select('*')
      .eq('user_id', userId)
      .order('measured_at', { ascending: false })
      .limit(30);

    // Calculate growth rate
    const growthRate = this.calculateGrowthRate(metrics);

    // Get post performance correlation
    const { data: performance } = await supabase
      .from('post_performance')
      .select('*, threads(*)')
      .eq('threads.user_id', userId)
      .order('posted_at', { ascending: false });

    return {
      metric: 'followers',
      currentValue: metrics[0].followers_count,
      predictedValue: this.predictGrowth(metrics),
      confidence: this.calculateConfidence(metrics),
      recommendedActions: this.getRecommendedActions(performance)
    };
  }

  async optimizePostingSchedule(userId: string) {
    const { data: performance } = await supabase
      .from('post_performance')
      .select('*')
      .eq('user_id', userId);

    // Analyze best performing posts
    const bestTimes = this.analyzeBestPostingTimes(performance);

    // Get growth targets
    const { data: targets } = await supabase
      .from('growth_targets')
      .select('*')
      .eq('user_id', userId);

    return this.generateOptimalSchedule(bestTimes, targets);
  }

  private calculateGrowthRate(metrics: AccountMetrics[]): number {
    // Calculate week-over-week growth rate
    const weeklyGrowth = metrics.reduce((acc, metric, i) => {
      if (i === 0) return acc;
      const growth = (metric.followersCount - metrics[i-1].followersCount) / metrics[i-1].followersCount;
      return acc + growth;
    }, 0) / (metrics.length - 1);

    return weeklyGrowth;
  }

  private analyzeBestPostingTimes(performance: PostPerformance[]) {
    // Group by hour and calculate average engagement
    const hourlyEngagement = performance.reduce((acc, post) => {
      const hour = new Date(post.posted_at).getHours();
      if (!acc[hour]) acc[hour] = [];
      acc[hour].push(post.engagementRate);
      return acc;
    }, {} as Record<number, number[]>);

    // Find top performing hours
    return Object.entries(hourlyEngagement)
      .map(([hour, rates]) => ({
        hour: parseInt(hour),
        avgEngagement: rates.reduce((a, b) => a + b) / rates.length
      }))
      .sort((a, b) => b.avgEngagement - a.avgEngagement)
      .slice(0, 5);
  }

  private generateOptimalSchedule(bestTimes: any[], targets: any[]) {
    const postsNeeded = this.calculatePostsNeeded(targets);

    return bestTimes.map(time => ({
      time: time.hour,
      frequency: this.distributePostFrequency(postsNeeded, bestTimes.length),
      expectedEngagement: time.avgEngagement
    }));
  }
}