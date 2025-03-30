'use client';

import { useState } from 'react';
import RevenueInput from '../components/RevenueInput';
import SummaryStats from '../components/SummaryStats';
import RevenueTable from '../components/RevenueTable';
import { RevenueEntry, SummaryStats as SummaryStatsType } from '../types';

export default function Home() {
  const [entries, setEntries] = useState<RevenueEntry[]>([]);

  const handleSubmit = (entry: RevenueEntry) => {
    setEntries([...entries, entry]);
  };

  const calculateSummaryStats = (): SummaryStatsType => {
    const totalPlanned = entries.reduce((sum, entry) => sum + entry.planned, 0);
    const totalActual = entries.reduce((sum, entry) => sum + entry.actual, 0);
    const averageAchievement = entries.reduce((sum, entry) => sum + entry.percentage, 0) / entries.length;
    const daysInTarget = entries.filter(entry => entry.percentage >= 100).length;

    return {
      totalPlanned,
      totalActual,
      averageAchievement,
      daysInTarget,
      totalDays: entries.length
    };
  };

  return (
    <main className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Система учета выручки
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <SummaryStats stats={calculateSummaryStats()} />
            <div className="mt-8 bg-white rounded-lg shadow">
              <RevenueTable entries={entries} />
            </div>
          </div>
          
          <div>
            <RevenueInput onSubmit={handleSubmit} />
          </div>
        </div>
      </div>
    </main>
  );
} 