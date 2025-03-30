'use client';

import { useState, useEffect } from 'react';
import { Store } from '@/app/types';
import EditStoreModal from '../components/EditStoreModal';
import StoreImageUploader from '../components/StoreImageUploader';

export default function Directory() {
  const [stores, setStores] = useState<Store[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [editingStore, setEditingStore] = useState<Store | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [bulkStores, setBulkStores] = useState<Partial<Store>[]>([]);

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/stores');
      if (!response.ok) {
        throw new Error('Failed to fetch stores');
      }
      const data = await response.json();
      setStores(data);
    } catch (error) {
      console.error('Error fetching stores:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveStore = async (store: Partial<Store>) => {
    try {
      const method = editingStore ? 'PUT' : 'POST';
      const body = editingStore ? { ...store, id: editingStore.id } : store;

      const response = await fetch('/api/stores', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error('Failed to save store');
      }

      await fetchStores();
      setIsModalOpen(false);
      setEditingStore(null);
    } catch (error) {
      console.error('Error saving store:', error);
      alert('Ошибка при сохранении ТО');
    }
  };

  const handleBulkSave = async (stores: Partial<Store>[]) => {
    try {
      const promises = stores.map(store => 
        fetch('/api/stores', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(store),
        })
      );

      await Promise.all(promises);
      await fetchStores();
      setIsUploadModalOpen(false);
      setBulkStores([]);
    } catch (error) {
      console.error('Error saving stores:', error);
      alert('Ошибка при сохранении торговых объектов');
    }
  };

  const handleDeleteStore = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот ТО?')) {
      return;
    }

    try {
      const response = await fetch(`/api/stores?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete store');
      }

      await fetchStores();
    } catch (error) {
      console.error('Error deleting store:', error);
      alert('Ошибка при удалении ТО');
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
            Справочник торговых объектов
          </h1>
          <div className="flex space-x-4">
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Загрузить изображение
            </button>
            <button
              onClick={() => {
                setEditingStore(null);
                setIsModalOpen(true);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Добавить ТО
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Группа
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Название
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stores.map((store) => (
                <tr key={store.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {store.group}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {store.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => {
                        setEditingStore(store);
                        setIsModalOpen(true);
                      }}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Редактировать
                    </button>
                    <button
                      onClick={() => handleDeleteStore(store.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Удалить
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <EditStoreModal
          store={editingStore}
          onSave={handleSaveStore}
          onClose={() => {
            setIsModalOpen(false);
            setEditingStore(null);
          }}
        />
      )}

      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Загрузка изображения</h2>
              <button
                onClick={() => {
                  setIsUploadModalOpen(false);
                  setUploadError(null);
                  setBulkStores([]);
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {uploadError && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600">{uploadError}</p>
              </div>
            )}
            <StoreImageUploader
              onDataRecognized={(data) => {
                if (data.group && data.name) {
                  setEditingStore(data as Store);
                  setIsUploadModalOpen(false);
                  setIsModalOpen(true);
                } else {
                  setUploadError('Не удалось распознать все необходимые данные. Пожалуйста, попробуйте еще раз.');
                  setBulkStores([...bulkStores, data]);
                }
              }}
            />
            {bulkStores.length > 0 && (
              <div className="mt-4">
                <button
                  onClick={() => handleBulkSave(bulkStores)}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Сохранить все торговые объекты
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
} 