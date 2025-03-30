import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { createWorker } from 'tesseract.js';

interface ImageUploaderProps {
  onDataExtracted: (data: { text: string; confidence: number }[]) => void;
  className?: string;
}

export default function ImageUploader({ onDataExtracted, className = '' }: ImageUploaderProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const processImage = async (file: File) => {
    setIsProcessing(true);
    setProgress(0);

    try {
      const worker = await createWorker('rus+eng');

      worker.setProgressHandler((p) => {
        setProgress(Math.round(p.progress * 100));
      });

      const { data } = await worker.recognize(file);
      
      // Извлекаем текст и уверенность распознавания для каждого блока
      const extractedData = data.words.map(word => ({
        text: word.text,
        confidence: word.confidence,
        bbox: word.bbox // Координаты блока текста
      }));

      await worker.terminate();
      onDataExtracted(extractedData);
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Ошибка при обработке изображения. Пожалуйста, попробуйте другое изображение.');
    } finally {
      setIsProcessing(false);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      processImage(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    multiple: false
  });

  return (
    <div 
      {...getRootProps()} 
      className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors ${
        isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
      } ${className}`}
    >
      <input {...getInputProps()} />
      {isProcessing ? (
        <div className="space-y-3">
          <div className="text-sm text-gray-600">Обработка изображения...</div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-sm text-gray-600">{progress}%</div>
        </div>
      ) : (
        <div>
          {isDragActive ? (
            <p className="text-blue-500">Отпустите файл здесь...</p>
          ) : (
            <div className="space-y-2">
              <p className="text-gray-600">
                Перетащите изображение сюда или нажмите для выбора
              </p>
              <p className="text-sm text-gray-500">
                Поддерживаются форматы PNG, JPG
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 