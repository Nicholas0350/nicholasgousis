'use client';

import { useEffect, useState } from 'react';
import { LineChart } from '@/components/Charts';
import type { GrowthPrediction, RecommendedAction } from '@/lib/types';

export function GrowthMonitor({ userId }: { userId: string }) {
  const [growth, setGrowth] = useState<GrowthPrediction | null>(null);

  useEffect(() => {
    const fetchGrowth = async () => {
      const res = await fetch('/api/optimize-schedule', {
        method: 'POST',
        body: JSON.stringify({ userId })
      });
      const data = await res.json();
      setGrowth(data.growth);
    };

    fetchGrowth();
  }, [userId]);

  if (!growth) return <div>Loading...</div>;

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Growth Tracking</h2>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3>Current Growth</h3>
          <LineChart data={growth.currentValue} />
        </div>

        <div>
          <h3>Predicted Growth</h3>
          <LineChart data={growth.predictedValue} />
        </div>
      </div>

      <div className="mt-6">
        <h3>Recommended Actions</h3>
        <ul>
          {growth.recommendedActions.map((action: RecommendedAction) => (
            <li key={action.action} className="flex justify-between">
              <span>{action.action}</span>
              <span>Impact: {action.impact}%</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}