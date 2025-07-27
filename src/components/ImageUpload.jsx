import { useState, useRef, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { saveImageToTemp, saveMultipleImagesToTemp, deleteSavedImage } from '../utils/imageStorage';

function ImageUpload({ images, onImagesChange }) {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });
  const fileInputRef = useRef(null);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const processAndSaveImages = useCallback(async (files) => {
    setIsUploading(true);
    setUploadProgress({ current: 0, total: files.length });
    
    try {
      const imageFiles = files.filter(file => file.type.startsWith('image/'));
      
      if (imageFiles.length === 0) {
        throw new Error('Не найдено изображений для загрузки');
      }
      
      const userId = user?.id || user?.email || 'default';
      
      // Используем новую функцию для массового сохранения
      const results = await saveMultipleImagesToTemp(imageFiles, userId);
      
      const newImages = [];
      
      // Обрабатываем успешно сохраненные изображения
      results.successful.forEach((url, index) => {
        const file = imageFiles[index];
        newImages.push({
          file,
          preview: url,
          savedId: `${userId}_${Date.now()}_${index}`,
          originalName: file.name,
          size: file.size,
          status: 'saved'
        });
      });
      
      // Обрабатываем неудачные загрузки
      results.failed.forEach((failedFile, index) => {
        const file = imageFiles.find(f => f.name === failedFile.fileName);
        if (file) {
          newImages.push({
            file,
            preview: URL.createObjectURL(file),
            originalName: file.name,
            size: file.size,
            status: 'failed',
            error: failedFile.error
          });
        }
      });
      
      onImagesChange([...images, ...newImages]);
      
      // Показываем уведомления о результатах
      if (results.successful.length > 0) {
        console.log(`Успешно сохранено ${results.successful.length} изображений`);
      }
      
      if (results.failed.length > 0) {
        console.warn(`Не удалось сохранить ${results.failed.length} изображений:`, results.failed);
      }
      
    } catch (error) {
      console.error('Ошибка при обработке изображений:', error);
      
      // Fallback: сохраняем как обычные preview
      const imageFiles = files.filter(file => file.type.startsWith('image/'));
      const fallbackImages = imageFiles.map(file => ({
        file,
        preview: URL.createObjectURL(file),
        originalName: file.name,
        size: file.size,
        status: 'fallback'
      }));
      
      onImagesChange([...images, ...fallbackImages]);
    } finally {
      setIsUploading(false);
      setUploadProgress({ current: 0, total: 0 });
    }
  }, [images, onImagesChange, user]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    processAndSaveImages(files);
  }, [processAndSaveImages]);

  const handleFileSelect = useCallback((e) => {
    const files = Array.from(e.target.files);
    processAndSaveImages(files);
  }, [processAndSaveImages]);

  const removeImage = useCallback((index) => {
    const imageToRemove = images[index];
    
    // Если изображение было сохранено в tempimage, удаляем его
    if (imageToRemove.savedId) {
      deleteSavedImage(imageToRemove.savedId);
    }
    
    // Освобождаем URL объект
    if (imageToRemove.preview && imageToRemove.preview.startsWith('blob:')) {
      URL.revokeObjectURL(imageToRemove.preview);
    }
    
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  }, [images, onImagesChange]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'saved':
        return (
          <div className="absolute top-1 left-1 bg-green-500 text-white text-xs px-1 py-0.5 rounded">
            ✓
          </div>
        );
      case 'failed':
        return (
          <div className="absolute top-1 left-1 bg-red-500 text-white text-xs px-1 py-0.5 rounded">
            ✗
          </div>
        );
      case 'fallback':
        return (
          <div className="absolute top-1 left-1 bg-yellow-500 text-white text-xs px-1 py-0.5 rounded">
            ⚠
          </div>
        );
      default:
        return null;
    }
  };

  const getStatusTooltip = (status, error) => {
    switch (status) {
      case 'saved':
        return 'Сохранено в tempimage';
      case 'failed':
        return `Ошибка: ${error}`;
      case 'fallback':
        return 'Сохранено локально (не в tempimage)';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {t('addItem.images')} ({images.length})
      </label>
      
      {/* Drag & Drop Zone */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragOver 
            ? 'border-violet-400 bg-violet-50' 
            : 'border-gray-300 hover:border-violet-300'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="space-y-2">
          <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div className="text-sm text-gray-600">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="text-violet-600 hover:text-violet-500 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? t('common.loading') : t('addItem.uploadImages')}
            </button>
            <span className="mx-2">{t('addItem.or')}</span>
            <span>{t('addItem.dragAndDrop')}</span>
          </div>
          <p className="text-xs text-gray-500">
            {t('addItem.imageFormats')}
          </p>
          {isUploading && (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-violet-600"></div>
              <span className="text-xs text-violet-600">
                {t('common.submitting')} ({uploadProgress.current}/{uploadProgress.total})
              </span>
            </div>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isUploading}
        />
      </div>

      {/* Preview Images */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <img
                src={image.preview}
                alt={`Preview ${index + 1}`}
                className="w-full h-24 object-cover rounded-lg"
                title={getStatusTooltip(image.status, image.error)}
              />
              
              {/* Статус сохранения */}
              {getStatusIcon(image.status)}
              
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
              >
                ×
              </button>
              
              {/* Информация о файле */}
              {image.originalName && (
                <div className="absolute bottom-1 left-1 right-1 bg-black/50 text-white text-xs px-1 py-0.5 rounded truncate">
                  {image.originalName}
                </div>
              )}
              
              {/* Размер файла */}
              {image.size && (
                <div className="absolute bottom-1 right-1 bg-black/50 text-white text-xs px-1 py-0.5 rounded">
                  {(image.size / 1024).toFixed(1)}KB
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ImageUpload; 