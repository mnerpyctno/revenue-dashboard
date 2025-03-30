import { Store } from '../types';
import { useState, useEffect } from 'react';

interface EditStoreModalProps {
  store?: Store;
  onSave: (store: Store) => void;
  onClose: () => void;
}

const STORE_GROUPS = ['VIP', 'A', 'B', 'C'] as const;
type StoreGroup = typeof STORE_GROUPS[number];

export default function EditStoreModal({ store, onSave, onClose }: EditStoreModalProps) {
  const [formData, setFormData] = useState<Omit<Store, 'id'>>({
    number: '',
    address: '',
    group: 'A',
    staffCount: 0,
    name: '',
    region: ''
  });

  useEffect(() => {
    if (store) {
      setFormData(store);
    }
  }, [store]);

  // Автоматическое формирование названия при изменении номера, региона или адреса
  useEffect(() => {
    const { number, region, address } = formData;
    if (number && address) {
      const parts = [number];
      if (region) parts.push(region);
      parts.push(address);
      const generatedName = parts.join(' ');
      setFormData(prev => ({ ...prev, name: generatedName }));
    }
  }, [formData.number, formData.region, formData.address]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: store?.id || crypto.randomUUID(),
      ...formData
    });
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">
          {store ? 'Редактировать ТО' : 'Добавить новый ТО'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Номер</label>
            <input
              type="text"
              value={formData.number}
              onChange={(e) => setFormData({ ...formData, number: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Адрес</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Группа</label>
            <select
              value={formData.group}
              onChange={(e) => setFormData({ ...formData, group: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              {STORE_GROUPS.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Количество персонала</label>
            <input
              type="number"
              value={formData.staffCount}
              onChange={(e) => setFormData({ ...formData, staffCount: parseInt(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              min="0"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Регион</label>
            <input
              type="text"
              value={formData.region || ''}
              onChange={(e) => setFormData({ ...formData, region: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Название ТО</label>
            <input
              type="text"
              value={formData.name}
              readOnly
              className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm"
              required
            />
            <p className="mt-1 text-sm text-gray-500">
              Формируется автоматически: Номер + Регион + Адрес
            </p>
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
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
            >
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 