'use client';

import { useState } from 'react';
import RevenueInput from './components/RevenueInput';
import SummaryStats from './components/SummaryStats';
import RevenueTable from './components/RevenueTable';

interface Revenue {
  amount: number;
  date: string;
}

export default function Home() {
  const [revenues, setRevenues] = useState<Revenue[]>([]);

  const handleAddRevenue = (amount: number, date: string) => {
    setRevenues([...revenues, { amount, date }]);
  };

  return (
    <main className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Система учета выручки
        </h1>
        
        <SummaryStats revenues={revenues} />
        
        <div className="bg-white rounded-lg shadow p-6">
          <RevenueInput onAddRevenue={handleAddRevenue} />
          <RevenueTable revenues={revenues} />
        </div>
      </div>
    </main>
  );
} 