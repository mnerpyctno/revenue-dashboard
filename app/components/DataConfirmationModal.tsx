import { useState, useEffect } from 'react';
import { MonthlyPlan } from '@prisma/client';

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

interface DataConfirmationModalProps {
  data: ExtractedData[];
  onConfirm: (mappedData: Partial<MonthlyPlan>) => void;
  onClose: () => void;
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
  data,
  onConfirm,
  onClose
}: DataConfirmationModalProps) {
  const [mappings, setMappings] = useState<Record<string, PlanField>>({});
  const [suggestedMappings, setSuggestedMappings] = useState<Record<string, PlanField>>({});

  useEffect(() => {
    // Автоматическое сопоставление на основе схожести текста
    const newSuggestedMappings: Record<string, PlanField> = {};
    
    data.forEach(({ text }) => {
      const normalizedText = text.toLowerCase().trim();
      
      // Находим наиболее похожее поле
      let bestMatch: { field: PlanField; similarity: number } | null = null;
      
      PLAN_FIELDS.forEach(({ key, label }) => {
        const normalizedLabel = label.toLowerCase();
        const similarity = calculateSimilarity(normalizedText, normalizedLabel);
        
        if (!bestMatch || similarity > bestMatch.similarity) {
          bestMatch = { field: key, similarity: similarity };
        }
      });
      
      if (bestMatch && bestMatch.similarity > 0.5) {
        newSuggestedMappings[text] = bestMatch.field;
      }
    });
    
    setSuggestedMappings(newSuggestedMappings);
    setMappings(newSuggestedMappings);
  }, [data]);

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
    const result: Partial<MonthlyPlan> = {};
    
    data.forEach(({ text }) => {
      const field = mappings[text];
      if (field) {
        const numericValue = parseFloat(text);
        if (!isNaN(numericValue)) {
          result[field] = numericValue;
        }
      }
    });
    
    onConfirm(result);
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
            {data.map(({ text, confidence }, index) => {
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
                        (уверенность: {Math.round(confidence)}%)
                      </span>
                    </div>
                    
                    {!isNumeric && (
                      <select
                        value={mappings[text] || ''}
                        onChange={(e) => setMappings({
                          ...mappings,
                          [text]: e.target.value as PlanField
                        })}
                        className="ml-4 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        <option value="">Выберите поле</option>
                        {PLAN_FIELDS.map(({ key, label }) => (
                          <option key={key} value={key}>
                            {label}
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