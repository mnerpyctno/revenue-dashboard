import { useState } from 'react';
import { createWorker, Worker, RecognizeResult } from 'tesseract.js';

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

interface ImageUploaderProps {
  onDataExtracted: (data: ExtractedData[]) => void;
  className?: string;
}

export default function ImageUploader({ onDataExtracted, className = '' }: ImageUploaderProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setProgress(0);

    try {
      const worker = await createWorker('rus') as Worker & { setProgressHandler: (handler: (progress: { progress: number }) => void) => void };

      // Обработчик прогресса
      worker.setProgressHandler((progress) => {
        setProgress(progress.progress * 100);
      });

      // Распознавание текста
      const result = await worker.recognize(file) as RecognizeResult;
      const words = (result.data as any).words as Array<{
        text: string;
        confidence: number;
        bbox: { x0: number; y0: number; x1: number; y1: number };
      }>;

      // Извлекаем текст и уверенность распознавания для каждого блока
      const extractedData = words.map((word) => ({
        text: word.text,
        confidence: word.confidence,
        bbox: word.bbox
      }));

      onDataExtracted(extractedData);
      await worker.terminate();
    } catch (error) {
      console.error('Error processing image:', error);
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-center w-full">
        <label
          htmlFor="image-upload"
          className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg
              className="w-8 h-8 mb-2 text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 16"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
              />
            </svg>
            <p className="mb-1 text-sm text-gray-500">
              <span className="font-semibold">Нажмите для загрузки</span> или перетащите
            </p>
            <p className="text-xs text-gray-500">PNG, JPG или JPEG (МАКС. 800x400px)</p>
          </div>
          <input
            id="image-upload"
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={isProcessing}
          />
        </label>
      </div>

      {isProcessing && (
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
} 