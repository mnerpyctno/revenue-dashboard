'use client';

interface Revenue {
  amount: number;
  date: string;
}

interface SummaryStatsProps {
  revenues: Revenue[];
}

export default function SummaryStats({ revenues }: SummaryStatsProps) {
  const totalRevenue = revenues.reduce((sum, revenue) => sum + revenue.amount, 0);
  const averageRevenue = revenues.length > 0 ? totalRevenue / revenues.length : 0;
  
  // Находим максимальный и минимальный доход
  const maxRevenue = revenues.length > 0 ? Math.max(...revenues.map(r => r.amount)) : 0;
  const minRevenue = revenues.length > 0 ? Math.min(...revenues.map(r => r.amount)) : 0;

  const stats = [
    { label: 'Общий доход', value: totalRevenue.toLocaleString('ru-RU') + ' ₽' },
    { label: 'Средний доход', value: averageRevenue.toLocaleString('ru-RU') + ' ₽' },
    { label: 'Максимальный доход', value: maxRevenue.toLocaleString('ru-RU') + ' ₽' },
    { label: 'Минимальный доход', value: minRevenue.toLocaleString('ru-RU') + ' ₽' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
        >
          <dt className="text-sm font-medium text-gray-500">{stat.label}</dt>
          <dd className="mt-1 text-3xl font-semibold text-gray-900">{stat.value}</dd>
        </div>
      ))}
    </div>
  );
} 