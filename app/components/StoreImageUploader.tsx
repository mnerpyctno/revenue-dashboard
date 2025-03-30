'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { createWorker } from 'tesseract.js';
import { Store } from '@/app/types';

interface RecognizedData {
  [key: string]: string;
}

interface StoreImageUploaderProps {
  onDataRecognized: (data: Partial<Store>) => void;
}

export default function StoreImageUploader({ onDataRecognized }: StoreImageUploaderProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [recognizedData, setRecognizedData] = useState<RecognizedData | null>(null);

  const processImage = async (file: File) => {
    setIsProcessing(true);
    try {
      const worker = await createWorker('rus');
      const { data: { text } } = await worker.recognize(file);
      await worker.terminate();

      // Парсим распознанный текст
      const lines = text.split('\n').filter(line => line.trim());
      const data: RecognizedData = {};
      
      lines.forEach(line => {
        const [key, value] = line.split(':').map(part => part.trim());
        if (key && value) {
          data[key.toLowerCase()] = value;
        }
      });

      setRecognizedData(data);

      // Преобразуем распознанные данные в формат Store
      const storeData: Partial<Store> = {
        name: data['название'] || data['name'] || '',
        group: data['группа'] || data['group'] || ''
      };

      onDataRecognized(storeData);
    } catch (error) {
      console.error('Ошибка при распознавании:', error);
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

      {recognizedData && (
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-medium mb-3">Распознанные данные:</h3>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(recognizedData).map(([key, value]) => (
              <div key={key} className="flex justify-between border-b pb-2">
                <span className="font-medium capitalize">{key}:</span>
                <span>{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 