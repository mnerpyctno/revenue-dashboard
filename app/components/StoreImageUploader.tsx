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

export default function StoreImageUploader({ onDataRecognized }: StoreImageUploaderProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [recognizedData, setRecognizedData] = useState<RecognizedData | null>(null);
  const [error, setError] = useState<string | null>(null);

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
    } finally {
      setIsProcessing(false);
    }
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
    </div>
  );
} 