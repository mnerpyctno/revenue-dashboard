'use client';

interface Revenue {
  amount: number;
  date: string;
}

interface RevenueTableProps {
  revenues: Revenue[];
}

export default function RevenueTable({ revenues }: RevenueTableProps) {
  // Сортируем доходы по дате (от новых к старым)
  const sortedRevenues = [...revenues].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Дата
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Сумма
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedRevenues.map((revenue, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {new Date(revenue.date).toLocaleDateString('ru-RU')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {revenue.amount.toLocaleString('ru-RU')} ₽
              </td>
            </tr>
          ))}
          {sortedRevenues.length === 0 && (
            <tr>
              <td colSpan={2} className="px-6 py-4 text-center text-sm text-gray-500">
                Нет данных о доходах
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
} 