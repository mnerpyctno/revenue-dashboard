'use client';

import { useState } from 'react';
import { Store, MonthlyPlan } from '../types';
import EditPlanModal from '../components/EditPlanModal';

export default function Plans() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [plans, setPlans] = useState<MonthlyPlan[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [editingPlan, setEditingPlan] = useState<MonthlyPlan | null>(null);

  const handleDoubleClick = (plan: MonthlyPlan) => {
    setEditingPlan(plan);
  };

  const handleSavePlan = (updatedPlan: MonthlyPlan) => {
    setPlans(plans.map(p => p.id === updatedPlan.id ? updatedPlan : p));
    setEditingPlan(null);
  };

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Планы продаж
          </h1>
          <div className="flex items-center gap-4">
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md"
            />
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              onClick={() => {/* Здесь будет создание нового плана */}}
            >
              Создать план
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Гр</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">ТО</th>
                <th colSpan={11} className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase bg-green-50">
                  Основные
                </th>
                <th colSpan={6} className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase bg-blue-50">
                  Допы
                </th>
              </tr>
              <tr>
                <th className="px-3 py-3"></th>
                <th className="px-3 py-3"></th>
                {/* Основные */}
                <th className="px-3 py-3 text-xs font-medium text-gray-500 bg-green-50">GSM</th>
                <th className="px-3 py-3 text-xs font-medium text-gray-500 bg-green-50">Гаджеты</th>
                <th className="px-3 py-3 text-xs font-medium text-gray-500 bg-green-50">Цифра</th>
                <th className="px-3 py-3 text-xs font-medium text-gray-500 bg-green-50">Заказ</th>
                <th className="px-3 py-3 text-xs font-medium text-gray-500 bg-green-50">Бытовая</th>
                <th className="px-3 py-3 text-xs font-medium text-gray-500 bg-green-50">Техно</th>
                <th className="px-3 py-3 text-xs font-medium text-gray-500 bg-green-50">Фешн</th>
                <th className="px-3 py-3 text-xs font-medium text-gray-500 bg-green-50">СП</th>
                <th className="px-3 py-3 text-xs font-medium text-gray-500 bg-green-50">Сервис</th>
                <th className="px-3 py-3 text-xs font-medium text-gray-500 bg-green-50">Смарт</th>
                <th className="px-3 py-3 text-xs font-medium text-gray-500 bg-green-50">Сим</th>
                {/* Допы */}
                <th className="px-3 py-3 text-xs font-medium text-gray-500 bg-blue-50">SKILL</th>
                <th className="px-3 py-3 text-xs font-medium text-gray-500 bg-blue-50">CLICK</th>
                <th className="px-3 py-3 text-xs font-medium text-gray-500 bg-blue-50">VP</th>
                <th className="px-3 py-3 text-xs font-medium text-gray-500 bg-blue-50">Наяву</th>
                <th className="px-3 py-3 text-xs font-medium text-gray-500 bg-blue-50">Спайс</th>
                <th className="px-3 py-3 text-xs font-medium text-gray-500 bg-blue-50">Авто</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {plans.map((plan) => {
                const store = stores.find(s => s.id === plan.storeId);
                return (
                  <tr key={plan.id} onDoubleClick={() => handleDoubleClick(plan)}>
                    <td className="px-3 py-2 whitespace-nowrap text-sm">{store?.group}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm">{store?.name}</td>
                    {/* Основные */}
                    <td className="px-3 py-2 whitespace-nowrap text-sm bg-green-50">{plan.basePlan.gsm}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm bg-green-50">{plan.basePlan.gadgets}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm bg-green-50">{plan.basePlan.digital}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm bg-green-50">{plan.basePlan.orders}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm bg-green-50">{plan.basePlan.household}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm bg-green-50">{plan.basePlan.tech}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm bg-green-50">{plan.basePlan.photo}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm bg-green-50">{plan.basePlan.sp}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm bg-green-50">{plan.basePlan.service}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm bg-green-50">{plan.basePlan.smart}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm bg-green-50">{plan.basePlan.sim}</td>
                    {/* Допы */}
                    <td className="px-3 py-2 whitespace-nowrap text-sm bg-blue-50">{plan.additionalPlan.skill}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm bg-blue-50">{plan.additionalPlan.click}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm bg-blue-50">{plan.additionalPlan.vp}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm bg-blue-50">{plan.additionalPlan.nayavu}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm bg-blue-50">{plan.additionalPlan.spice}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm bg-blue-50">{plan.additionalPlan.auto}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      
      {editingPlan && (
        <EditPlanModal
          plan={editingPlan}
          onSave={handleSavePlan}
          onClose={() => setEditingPlan(null)}
        />
      )}
    </main>
  );
} 