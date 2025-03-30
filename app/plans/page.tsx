'use client';

import { useState } from 'react';
import { Store, MonthlyPlan } from '@prisma/client';
import EditPlanModal from '../components/EditPlanModal';
import ImageUploader from '../components/ImageUploader';
import DataConfirmationModal from '../components/DataConfirmationModal';

interface ExtractedData {
  text: string;
  confidence: number;
  bbox: {
    x0: number;
    y0: number;
    x1: number;
    y1: number;
  };
}

export default function Plans() {
  const [selectedMonth, setSelectedMonth] = useState<string>(
    new Date().toISOString().slice(0, 7)
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<MonthlyPlan | null>(null);
  const [isImageUploaderOpen, setIsImageUploaderOpen] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedData[] | null>(null);

  const handleDataExtracted = (data: ExtractedData[]) => {
    setExtractedData(data);
    setIsImageUploaderOpen(false);
  };

  const handleDataConfirmed = async (mappedData: Partial<MonthlyPlan>) => {
    try {
      // Здесь будет логика сохранения данных
      console.log('Mapped data:', mappedData);
      setExtractedData(null);
    } catch (error) {
      console.error('Error saving plan:', error);
      alert('Ошибка при сохранении плана');
    }
  };

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Планы продаж
          </h1>
          <div className="flex items-center space-x-4">
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <button
              onClick={() => setIsImageUploaderOpen(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Загрузить из изображения
            </button>
            <button
              onClick={() => {
                setEditingPlan(null);
                setIsModalOpen(true);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
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
      
      {isImageUploaderOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <h2 className="text-xl font-semibold mb-4">
              Загрузка плана из изображения
            </h2>
            <ImageUploader
              onDataExtracted={handleDataExtracted}
              className="h-64"
            />
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setIsImageUploaderOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}

      {extractedData && (
        <DataConfirmationModal
          data={extractedData}
          onConfirm={handleDataConfirmed}
          onClose={() => setExtractedData(null)}
        />
      )}

      {isModalOpen && (
        <EditPlanModal
          plan={editingPlan}
          onSave={(plan) => {
            // Здесь будет логика сохранения плана
            setIsModalOpen(false);
          }}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </main>
  );
} 