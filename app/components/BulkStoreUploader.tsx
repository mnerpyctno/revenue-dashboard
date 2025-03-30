'use client';

import { useState, useCallback } from 'react';
import { Store } from '@/app/types';

interface BulkStoreUploaderProps {
  onDataRecognized: (data: Partial<Store>[]) => void;
}

interface ColumnMapping {
  group: string;
  name: string;
}

const AVAILABLE_HEADERS = [
  { value: 'Гр', label: 'Группа' },
  { value: 'ТО', label: 'Название' },
  { value: 'Группа', label: 'Группа' },
  { value: 'Название', label: 'Название' },
  { value: 'Group', label: 'Группа' },
  { value: 'Name', label: 'Название' },
];

export default function BulkStoreUploader({ onDataRecognized }: BulkStoreUploaderProps) {
  const [inputData, setInputData] = useState('');
  const [headers, setHeaders] = useState<string[]>([]);
  const [columnMapping, setColumnMapping] = useState<ColumnMapping>({ group: '', name: '' });
  const [error, setError] = useState<string | null>(null);

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    setInputData(pastedData);
    
    // Разбиваем данные на строки и определяем заголовки
    const lines = pastedData.split('\n').filter(line => line.trim());
    if (lines.length > 0) {
      const headerLine = lines[0].split('\t');
      setHeaders(headerLine);
      
      // Автоматически определяем соответствие колонок
      const mapping: ColumnMapping = { group: '', name: '' };
      headerLine.forEach((header, index) => {
        const matchingHeader = AVAILABLE_HEADERS.find(h => h.value === header);
        if (matchingHeader) {
          if (matchingHeader.label === 'Группа') {
            mapping.group = header;
          } else if (matchingHeader.label === 'Название') {
            mapping.name = header;
          }
        }
      });
      setColumnMapping(mapping);
    }
  };

  const handleHeaderChange = (header: string, field: keyof ColumnMapping) => {
    setColumnMapping(prev => ({
      ...prev,
      [field]: header
    }));
  };

  const handleSubmit = () => {
    if (!columnMapping.group || !columnMapping.name) {
      setError('Пожалуйста, укажите соответствие колонок');
      return;
    }

    const lines = inputData.split('\n').filter(line => line.trim());
    if (lines.length < 2) {
      setError('Нет данных для обработки');
      return;
    }

    const headerLine = lines[0].split('\t');
    const groupIndex = headerLine.indexOf(columnMapping.group);
    const nameIndex = headerLine.indexOf(columnMapping.name);

    if (groupIndex === -1 || nameIndex === -1) {
      setError('Не удалось найти указанные колонки в данных');
      return;
    }

    const stores: Partial<Store>[] = lines.slice(1).map(line => {
      const values = line.split('\t');
      return {
        group: values[groupIndex]?.trim() || '',
        name: values[nameIndex]?.trim() || ''
      };
    }).filter(store => store.group && store.name);

    if (stores.length === 0) {
      setError('Не удалось извлечь данные из вставленного текста');
      return;
    }

    onDataRecognized(stores);
    setError(null);
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-medium mb-4">Массовое добавление торговых объектов</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Вставьте данные (Ctrl+V)
            </label>
            <textarea
              value={inputData}
              onChange={(e) => setInputData(e.target.value)}
              onPaste={handlePaste}
              className="w-full h-32 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Вставьте данные из буфера обмена..."
            />
          </div>

          {headers.length > 0 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Колонка с группой
                  </label>
                  <select
                    value={columnMapping.group}
                    onChange={(e) => handleHeaderChange(e.target.value, 'group')}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Выберите колонку</option>
                    {headers.map((header) => (
                      <option key={header} value={header}>
                        {header}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Колонка с названием
                  </label>
                  <select
                    value={columnMapping.name}
                    onChange={(e) => handleHeaderChange(e.target.value, 'name')}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Выберите колонку</option>
                    {headers.map((header) => (
                      <option key={header} value={header}>
                        {header}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {headers.map((header, index) => (
                        <th
                          key={index}
                          className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider
                            ${header === columnMapping.group ? 'bg-blue-50' : ''}
                            ${header === columnMapping.name ? 'bg-green-50' : ''}`}
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {inputData.split('\n').slice(1).map((line, rowIndex) => (
                      <tr key={rowIndex}>
                        {line.split('\t').map((cell, cellIndex) => (
                          <td key={cellIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Сохранить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 