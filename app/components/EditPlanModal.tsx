'use client';

import { useState } from 'react';
import { MonthlyPlan } from '../types';
import ImageUploader from './ImageUploader';

interface EditPlanModalProps {
  plan: MonthlyPlan | null;
  onSave: (plan: MonthlyPlan) => void;
  onClose: () => void;
}

export default function EditPlanModal({ plan, onSave, onClose }: EditPlanModalProps) {
  if (!plan) return null;
  
  const [editedPlan, setEditedPlan] = useState<MonthlyPlan>({ ...plan });

  const handleSave = () => {
    onSave(editedPlan);
    onClose();
  };

  const handleChange = (field: keyof MonthlyPlan, value: string) => {
    setEditedPlan({
      ...editedPlan,
      [field]: Number(value)
    });
  };

  const handleDataRecognized = (recognizedData: Partial<MonthlyPlan>) => {
    setEditedPlan({
      ...editedPlan,
      ...recognizedData
    });
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Редактирование планов</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Загрузить из изображения</h3>
          <ImageUploader onDataRecognized={handleDataRecognized} />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              SKILL
            </label>
            <input
              type="number"
              value={editedPlan.skill}
              onChange={(e) => handleChange('skill', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CLICK
            </label>
            <input
              type="number"
              value={editedPlan.click}
              onChange={(e) => handleChange('click', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              VP
            </label>
            <input
              type="number"
              value={editedPlan.vp}
              onChange={(e) => handleChange('vp', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Наяву
            </label>
            <input
              type="number"
              value={editedPlan.nayavu}
              onChange={(e) => handleChange('nayavu', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Спайс
            </label>
            <input
              type="number"
              value={editedPlan.spice}
              onChange={(e) => handleChange('spice', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Авто
            </label>
            <input
              type="number"
              value={editedPlan.auto}
              onChange={(e) => handleChange('auto', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Отмена
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
} 