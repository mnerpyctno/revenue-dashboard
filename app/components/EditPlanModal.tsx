'use client';

import { useState } from 'react';
import { MonthlyPlan } from '../types';

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

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">Редактирование дополнительных планов</h2>
        
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

        <div className="flex justify-end gap-4">
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