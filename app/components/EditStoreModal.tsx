'use client';

import { useState, useEffect } from 'react';
import { Store } from '@/app/types';
import StoreImageUploader from './StoreImageUploader';

interface EditStoreModalProps {
  store: Store | null;
  onSave: (store: Partial<Store>) => void;
  onClose: () => void;
}

export default function EditStoreModal({ store, onSave, onClose }: EditStoreModalProps) {
  const [formData, setFormData] = useState<Partial<Store>>({
    name: '',
    group: '',
  });

  useEffect(() => {
    if (store) {
      setFormData({
        name: store.name,
        group: store.group,
      });
    }
  }, [store]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (field: keyof Store, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDataRecognized = (data: Partial<Store>) => {
    setFormData(prev => ({
      ...prev,
      ...data
    }));
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
        <h2 className="text-xl font-semibold mb-4">
          {store ? 'Редактировать ТО' : 'Создать ТО'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Группа
              </label>
              <input
                type="text"
                value={formData.group}
                onChange={(e) => handleChange('group', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Название
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Загрузить изображение для распознавания данных
            </h3>
            <StoreImageUploader onDataRecognized={handleDataRecognized} />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 