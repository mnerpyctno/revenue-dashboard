'use client';

import { useState, useEffect } from 'react';
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

type PlanFields = Omit<MonthlyPlan, 'id' | 'createdAt' | 'updatedAt'>;
type PlanFieldKey = keyof PlanFields;

const PLAN_FIELDS: PlanFieldKey[] = [
  'gsm',
  'gadgets',
  'digital',
  'orders',
  'household',
  'tech',
  'photo',
  'sp',
  'service',
  'smart',
  'sim',
  'skill',
  'click',
  'vp',
  'nayavu',
  'spice',
  'auto'
];

export default function Plans() {
  const [stores, setStores] = useState<Store[]>([]);
  const [plans, setPlans] = useState<MonthlyPlan[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>(
    new Date().toISOString().slice(0, 7)
  );
  const [selectedStore, setSelectedStore] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<MonthlyPlan | null>(null);
  const [isImageUploaderOpen, setIsImageUploaderOpen] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedData[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [selectedMonth]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [storesResponse, plansResponse] = await Promise.all([
        fetch('/api/stores'),
        fetch(`/api/plans?month=${selectedMonth}`)
      ]);

      if (!storesResponse.ok || !plansResponse.ok) {
        throw new Error('Failed to fetch data');
      }

      const [storesData, plansData] = await Promise.all([
        storesResponse.json(),
        plansResponse.json()
      ]);

      setStores(storesData);
      setPlans(plansData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDataExtracted = (data: ExtractedData[]) => {
    setExtractedData(data);
    setIsImageUploaderOpen(false);
  };

  const handleDataConfirmed = async (mappings: Record<string, string>) => {
    if (!selectedStore || !selectedMonth) return;

    const planData: PlanFields = {
      storeId: selectedStore,
      month: selectedMonth,
      gsm: 0,
      gadgets: 0,
      digital: 0,
      orders: 0,
      household: 0,
      tech: 0,
      photo: 0,
      sp: 0,
      service: 0,
      smart: 0,
      sim: 0,
      skill: 0,
      click: 0,
      vp: 0,
      nayavu: 0,
      spice: 0,
      auto: 0,
    };

    // Преобразуем строковые значения в числа
    Object.entries(mappings).forEach(([text, field]) => {
      const numericValue = parseFloat(text);
      if (!isNaN(numericValue)) {
        const key = field as PlanFieldKey;
        if (PLAN_FIELDS.includes(key)) {
          (planData[key] as number) = numericValue;
        }
      }
    });

    try {
      const response = await fetch('/api/plans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(planData),
      });

      if (!response.ok) {
        throw new Error('Failed to save plan');
      }

      const savedPlan = await response.json() as MonthlyPlan;
      if (!savedPlan) {
        throw new Error('Invalid response from server');
      }

      setPlans(prevPlans => {
        const existingIndex = prevPlans.findIndex(p => p.id === savedPlan.id);
        if (existingIndex >= 0) {
          const updatedPlans = [...prevPlans];
          updatedPlans[existingIndex] = savedPlan;
          return updatedPlans;
        }
        return [...prevPlans, savedPlan];
      });

      setExtractedData(null);
    } catch (error) {
      console.error('Error saving plan:', error);
      alert('Ошибка при сохранении плана');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Загрузка...</div>
      </div>
    );
  }

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
                  <tr key={plan.id} onDoubleClick={() => setEditingPlan(plan)}>
                    <td className="px-3 py-2 whitespace-nowrap text-sm">{store?.group}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm">{store?.name}</td>
                    {/* Основные */}
                    <td className="px-3 py-2 whitespace-nowrap text-sm bg-green-50">{plan.gsm}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm bg-green-50">{plan.gadgets}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm bg-green-50">{plan.digital}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm bg-green-50">{plan.orders}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm bg-green-50">{plan.household}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm bg-green-50">{plan.tech}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm bg-green-50">{plan.photo}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm bg-green-50">{plan.sp}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm bg-green-50">{plan.service}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm bg-green-50">{plan.smart}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm bg-green-50">{plan.sim}</td>
                    {/* Допы */}
                    <td className="px-3 py-2 whitespace-nowrap text-sm bg-blue-50">{plan.skill}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm bg-blue-50">{plan.click}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm bg-blue-50">{plan.vp}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm bg-blue-50">{plan.nayavu}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm bg-blue-50">{plan.spice}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm bg-blue-50">{plan.auto}</td>
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
          isOpen={true}
          onConfirm={handleDataConfirmed}
          onClose={() => setExtractedData(null)}
          recognizedData={extractedData.map(item => item.text)}
          availableFields={[
            'gsm',
            'gadgets',
            'digital',
            'orders',
            'household',
            'tech',
            'photo',
            'sp',
            'service',
            'smart',
            'sim',
            'skill',
            'click',
            'vp',
            'nayavu',
            'spice',
            'auto'
          ]}
        />
      )}

      {isModalOpen && (
        <EditPlanModal
          plan={editingPlan}
          onSave={async (plan) => {
            try {
              const response = await fetch('/api/plans', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(plan),
              });

              if (!response.ok) {
                throw new Error('Failed to save plan');
              }

              await fetchData();
              setIsModalOpen(false);
            } catch (error) {
              console.error('Error saving plan:', error);
              alert('Ошибка при сохранении плана');
            }
          }}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </main>
  );
} 