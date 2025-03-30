'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { createWorker } from 'tesseract.js';
import { Store } from '@/app/types';

interface RecognizedData {
  group?: string;
  name?: string;
}

interface StoreImageUploaderProps {
  onDataRecognized: (data: Partial<Store>) => void;
}

interface BulkStore {
  group: string;
  name: string;
}

export default function StoreImageUploader({ onDataRecognized }: StoreImageUploaderProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [recognizedData, setRecognizedData] = useState<RecognizedData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [bulkStores, setBulkStores] = useState<BulkStore[]>([]);
  const [showBulkForm, setShowBulkForm] = useState(false);

  const processImage = async (file: File) => {
    setIsProcessing(true);
    setError(null);
    try {
      const worker = await createWorker('rus');
      const { data: { text } } = await worker.recognize(file);
      await worker.terminate();

      // Парсим распознанный текст
      const lines = text.split('\n').filter(line => line.trim());
      const data: RecognizedData = {};
      
      // Ищем ключевые слова в тексте
      lines.forEach(line => {
        const lowerLine = line.toLowerCase();
        
        // Проверяем наличие ключевых слов
        if (lowerLine.includes('группа') || lowerLine.includes('group')) {
          const value = line.split(/[:|]/)[1]?.trim();
          if (value) data.group = value;
        }
        
        if (lowerLine.includes('название') || lowerLine.includes('name')) {
          const value = line.split(/[:|]/)[1]?.trim();
          if (value) data.name = value;
        }
      });

      // Проверяем, удалось ли распознать необходимые данные
      if (!data.group || !data.name) {
        setError('Не удалось распознать все необходимые данные. Пожалуйста, проверьте качество изображения.');
        setShowBulkForm(true);
      }

      setRecognizedData(data);

      // Отправляем данные только если они были успешно распознаны
      if (data.group && data.name) {
        onDataRecognized({
          group: data.group,
          name: data.name
        });
      }
    } catch (error) {
      console.error('Ошибка при распознавании:', error);
      setError('Произошла ошибка при распознавании изображения. Пожалуйста, попробуйте еще раз.');
      setShowBulkForm(true);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddBulkStore = () => {
    const newStore: BulkStore = { group: '', name: '' };
    setBulkStores([...bulkStores, newStore]);
  };

  const handleUpdateBulkStore = (index: number, field: keyof BulkStore, value: string) => {
    const updatedStores = [...bulkStores];
    updatedStores[index] = { ...updatedStores[index], [field]: value };
    setBulkStores(updatedStores);
  };

  const handleRemoveBulkStore = (index: number) => {
    const updatedStores = bulkStores.filter((_, i) => i !== index);
    setBulkStores(updatedStores);
  };

  const handleSubmitBulkStores = () => {
    // Проверяем, что все поля заполнены
    const hasEmptyFields = bulkStores.some(store => !store.group || !store.name);
    if (hasEmptyFields) {
      setError('Пожалуйста, заполните все поля');
      return;
    }

    // Отправляем каждый торговый объект
    bulkStores.forEach(store => {
      onDataRecognized(store);
    });

    // Очищаем форму
    setBulkStores([]);
    setShowBulkForm(false);
    setError(null);
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      processImage(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    maxFiles: 1
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500'}`}
      >
        <input {...getInputProps()} />
        {isProcessing ? (
          <div className="text-gray-600">
            <svg className="animate-spin h-6 w-6 mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Распознавание...
          </div>
        ) : isDragActive ? (
          <p className="text-blue-500">Перетащите файл сюда...</p>
        ) : (
          <div>
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3 3m0 0l-3-3m3 3V8" />
            </svg>
            <p className="text-gray-600">Перетащите изображение или кликните для выбора</p>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {recognizedData && !error && (
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-medium mb-3">Распознанные данные:</h3>
          <div className="space-y-2">
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium">Группа:</span>
              <span>{recognizedData.group || 'Не распознано'}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium">Название:</span>
              <span>{recognizedData.name || 'Не распознано'}</span>
            </div>
          </div>
        </div>
      )}

      {showBulkForm && (
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-medium mb-4">Массовое добавление торговых объектов</h3>
          <div className="space-y-4">
            {bulkStores.map((store, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Группа"
                    value={store.group}
                    onChange={(e) => handleUpdateBulkStore(index, 'group', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Название"
                    value={store.name}
                    onChange={(e) => handleUpdateBulkStore(index, 'name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  onClick={() => handleRemoveBulkStore(index)}
                  className="p-2 text-red-600 hover:text-red-800"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
            <div className="flex justify-between">
              <button
                onClick={handleAddBulkStore}
                className="px-4 py-2 text-blue-600 hover:text-blue-800 flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Добавить еще
              </button>
              <button
                onClick={handleSubmitBulkStores}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Сохранить все
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 