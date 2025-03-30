import { useState, useEffect } from 'react';
import { MonthlyPlan } from '@/app/types';

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

type PlanField = keyof Omit<MonthlyPlan, 'id' | 'storeId' | 'store' | 'month' | 'createdAt' | 'updatedAt'>;

interface BestMatch {
  field: string;
  similarity: number;
}

interface DataConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (mappings: Record<string, string>) => void;
  recognizedData: string[];
  availableFields: string[];
}

const PLAN_FIELDS: { key: PlanField; label: string }[] = [
  { key: 'gsm', label: 'GSM' },
  { key: 'gadgets', label: 'Гаджеты' },
  { key: 'digital', label: 'Digital' },
  { key: 'orders', label: 'Заказы' },
  { key: 'household', label: 'Бытовая техника' },
  { key: 'tech', label: 'Техника' },
  { key: 'photo', label: 'Фото' },
  { key: 'sp', label: 'SP' },
  { key: 'service', label: 'Сервис' },
  { key: 'smart', label: 'Smart' },
  { key: 'sim', label: 'SIM' },
  { key: 'skill', label: 'Skill' },
  { key: 'click', label: 'Click' },
  { key: 'vp', label: 'VP' },
  { key: 'nayavu', label: 'Наяву' },
  { key: 'spice', label: 'Spice' },
  { key: 'auto', label: 'Auto' }
];

export default function DataConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  recognizedData,
  availableFields,
}: DataConfirmationModalProps) {
  const [mappings, setMappings] = useState<Record<string, string>>({});
  const [suggestedMappings, setSuggestedMappings] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      const newSuggestedMappings: Record<string, string> = {};
      
      recognizedData.forEach((text) => {
        const bestMatch = availableFields.reduce<BestMatch | null>((best, field) => {
          const similarity = calculateSimilarity(text.toLowerCase(), field.toLowerCase());
          if (!best || similarity > best.similarity) {
            return { field, similarity };
          }
          return best;
        }, null);

        if (bestMatch && bestMatch.similarity > 0.5) {
          newSuggestedMappings[text] = bestMatch.field;
        }
      });

      setSuggestedMappings(newSuggestedMappings);
      setMappings(newSuggestedMappings);
    }
  }, [isOpen, recognizedData, availableFields]);

  const calculateSimilarity = (str1: string, str2: string): number => {
    const len1 = str1.length;
    const len2 = str2.length;
    const matrix: number[][] = Array(len1 + 1).fill(null).map(() => Array(len2 + 1).fill(0));

    for (let i = 0; i <= len1; i++) matrix[i][0] = i;
    for (let j = 0; j <= len2; j++) matrix[0][j] = j;

    for (let i = 1; i <= len1; i++) {
      for (let j = 1; j <= len2; j++) {
        const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + cost
        );
      }
    }

    const maxLen = Math.max(len1, len2);
    return 1 - matrix[len1][len2] / maxLen;
  };

  const handleConfirm = () => {
    const result: Record<string, string> = {};
    
    recognizedData.forEach((text) => {
      const field = mappings[text];
      if (field) {
        const numericValue = parseFloat(text);
        if (!isNaN(numericValue)) {
          result[field] = numericValue.toString();
        }
      }
    });

    onConfirm(result);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">
          Подтверждение данных
        </h2>
        
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Пожалуйста, проверьте и скорректируйте сопоставление распознанных данных с полями плана:
          </p>
          
          <div className="grid grid-cols-1 gap-4">
            {recognizedData.map((text, index) => {
              const isNumeric = !isNaN(parseFloat(text));
              
              return (
                <div
                  key={index}
                  className={`p-4 border rounded-lg ${
                    isNumeric ? 'bg-gray-50' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">{text}</span>
                      <span className="ml-2 text-sm text-gray-500">
                        (уверенность: {Math.round(parseFloat(text) * 100)}%)
                      </span>
                    </div>
                    
                    {!isNumeric && (
                      <select
                        value={mappings[text] || ''}
                        onChange={(e) => setMappings({
                          ...mappings,
                          [text]: e.target.value
                        })}
                        className="ml-4 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        <option value="">Выберите поле</option>
                        {availableFields.map((field) => (
                          <option key={field} value={field}>
                            {field}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
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
            onClick={handleConfirm}
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
          >
            Подтвердить
          </button>
        </div>
      </div>
    </div>
  );
} 