// Утилиты для сохранения изображений в папку tempimage

// Константы
const STORAGE_KEY = 'tempImages';
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const SUPPORTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

/**
 * Валидирует файл изображения
 * @param {File} file - Файл для валидации
 * @returns {Object} - Результат валидации
 */
const validateImageFile = (file) => {
  const errors = [];
  
  if (!file) {
    errors.push('Файл не выбран');
    return { isValid: false, errors };
  }
  
  if (!SUPPORTED_TYPES.includes(file.type)) {
    errors.push(`Неподдерживаемый тип файла: ${file.type}. Поддерживаются: ${SUPPORTED_TYPES.join(', ')}`);
  }
  
  if (file.size > MAX_FILE_SIZE) {
    errors.push(`Размер файла превышает ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Получает сохраненные изображения из localStorage
 * @returns {Array} - Массив изображений
 */
const getStoredImages = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch (error) {
    console.error('Ошибка при чтении изображений из localStorage:', error);
    return [];
  }
};

/**
 * Сохраняет изображения в localStorage
 * @param {Array} images - Массив изображений
 */
const saveStoredImages = (images) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(images));
  } catch (error) {
    console.error('Ошибка при сохранении изображений в localStorage:', error);
    throw new Error('Не удалось сохранить изображения');
  }
};

/**
 * Создает уникальный ID для изображения
 * @param {string} userId - ID пользователя
 * @returns {string} - Уникальный ID
 */
const generateImageId = (userId) => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9);
  return `${userId}_${timestamp}_${random}`;
};

/**
 * Сохраняет файл изображения в папку tempimage
 * @param {File} file - Файл изображения
 * @param {string} userId - ID пользователя (для организации файлов)
 * @returns {Promise<string>} - Путь к сохраненному файлу
 */
export const saveImageToTemp = async (file, userId = 'default') => {
  try {
    // Валидация файла
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      throw new Error(`Ошибка валидации: ${validation.errors.join(', ')}`);
    }

    // Создаем уникальное имя файла
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop().toLowerCase();
    const fileName = `${userId}_${timestamp}.${fileExtension}`;
    const imageId = generateImageId(userId);
    
    // Создаем URL для изображения
    const imageUrl = URL.createObjectURL(file);
    
    // Подготавливаем информацию о файле
    const imageInfo = {
      id: imageId,
      fileName: fileName,
      url: imageUrl,
      originalName: file.name,
      size: file.size,
      type: file.type,
      userId: userId,
      uploadDate: new Date().toISOString(),
      path: `tempimage/${fileName}`,
      lastAccessed: new Date().toISOString()
    };
    
    // Получаем существующие изображения и добавляем новое
    const savedImages = getStoredImages();
    savedImages.push(imageInfo);
    
    // Сохраняем обновленный список
    saveStoredImages(savedImages);
    
    console.log('Изображение успешно сохранено:', {
      id: imageInfo.id,
      fileName: imageInfo.fileName,
      size: `${(imageInfo.size / 1024).toFixed(2)}KB`
    });
    
    return imageUrl;
  } catch (error) {
    console.error('Ошибка при сохранении изображения:', error);
    throw error;
  }
};

/**
 * Сохраняет массив изображений с обработкой ошибок
 * @param {File[]} files - Массив файлов изображений
 * @param {string} userId - ID пользователя
 * @returns {Promise<Object>} - Результат сохранения
 */
export const saveMultipleImagesToTemp = async (files, userId = 'default') => {
  const results = {
    successful: [],
    failed: [],
    total: files.length
  };
  
  // Обрабатываем файлы параллельно с ограничением
  const batchSize = 3; // Максимум 3 файла одновременно
  for (let i = 0; i < files.length; i += batchSize) {
    const batch = files.slice(i, i + batchSize);
    const batchPromises = batch.map(async (file) => {
      try {
        const url = await saveImageToTemp(file, userId);
        return { success: true, url, fileName: file.name };
      } catch (error) {
        return { success: false, error: error.message, fileName: file.name };
      }
    });
    
    const batchResults = await Promise.all(batchPromises);
    
    batchResults.forEach(result => {
      if (result.success) {
        results.successful.push(result.url);
      } else {
        results.failed.push({ fileName: result.fileName, error: result.error });
      }
    });
  }
  
  console.log(`Сохранение завершено: ${results.successful.length} успешно, ${results.failed.length} неудачно`);
  return results;
};

/**
 * Получает все сохраненные изображения пользователя
 * @param {string} userId - ID пользователя
 * @returns {Array} - Массив информации о сохраненных изображениях
 */
export const getSavedImages = (userId = 'default') => {
  try {
    const savedImages = getStoredImages();
    const userImages = savedImages.filter(img => img.userId === userId);
    
    // Сортируем по дате загрузки (новые сначала)
    return userImages.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
  } catch (error) {
    console.error('Ошибка при получении сохраненных изображений:', error);
    return [];
  }
};

/**
 * Удаляет сохраненное изображение
 * @param {string} imageId - ID изображения
 * @returns {boolean} - Успешность удаления
 */
export const deleteSavedImage = (imageId) => {
  try {
    const savedImages = getStoredImages();
    const imageToDelete = savedImages.find(img => img.id === imageId);
    
    if (imageToDelete) {
      // Освобождаем URL объект
      URL.revokeObjectURL(imageToDelete.url);
      
      // Удаляем из массива
      const updatedImages = savedImages.filter(img => img.id !== imageId);
      saveStoredImages(updatedImages);
      
      console.log('Изображение успешно удалено:', imageId);
      return true;
    }
    
    console.warn('Изображение не найдено для удаления:', imageId);
    return false;
  } catch (error) {
    console.error('Ошибка при удалении изображения:', error);
    return false;
  }
};

/**
 * Очищает все временные изображения пользователя
 * @param {string} userId - ID пользователя
 * @returns {number} - Количество удаленных изображений
 */
export const clearUserTempImages = (userId = 'default') => {
  try {
    const savedImages = getStoredImages();
    const userImages = savedImages.filter(img => img.userId === userId);
    
    // Освобождаем URL объекты
    userImages.forEach(img => {
      URL.revokeObjectURL(img.url);
    });
    
    // Удаляем изображения пользователя
    const updatedImages = savedImages.filter(img => img.userId !== userId);
    saveStoredImages(updatedImages);
    
    console.log(`Очищены временные изображения пользователя ${userId}: ${userImages.length} файлов`);
    return userImages.length;
  } catch (error) {
    console.error('Ошибка при очистке временных изображений:', error);
    return 0;
  }
};

/**
 * Получает статистику по сохраненным изображениям
 * @returns {Object} - Статистика
 */
export const getImageStorageStats = () => {
  try {
    const savedImages = getStoredImages();
    const totalSize = savedImages.reduce((sum, img) => sum + img.size, 0);
    const uniqueUsers = [...new Set(savedImages.map(img => img.userId))];
    
    // Статистика по типам файлов
    const typeStats = savedImages.reduce((acc, img) => {
      acc[img.type] = (acc[img.type] || 0) + 1;
      return acc;
    }, {});
    
    return {
      totalImages: savedImages.length,
      totalSize: totalSize,
      totalSizeMB: (totalSize / (1024 * 1024)).toFixed(2),
      users: uniqueUsers,
      userCount: uniqueUsers.length,
      typeStats: typeStats,
      averageSize: savedImages.length > 0 ? (totalSize / savedImages.length / 1024).toFixed(2) : 0
    };
  } catch (error) {
    console.error('Ошибка при получении статистики:', error);
    return { 
      totalImages: 0, 
      totalSize: 0, 
      totalSizeMB: '0', 
      users: [], 
      userCount: 0,
      typeStats: {},
      averageSize: 0
    };
  }
};

/**
 * Обновляет время последнего доступа к изображению
 * @param {string} imageId - ID изображения
 */
export const updateImageAccessTime = (imageId) => {
  try {
    const savedImages = getStoredImages();
    const imageIndex = savedImages.findIndex(img => img.id === imageId);
    
    if (imageIndex !== -1) {
      savedImages[imageIndex].lastAccessed = new Date().toISOString();
      saveStoredImages(savedImages);
    }
  } catch (error) {
    console.error('Ошибка при обновлении времени доступа:', error);
  }
};

/**
 * Получает изображения, которые не использовались долгое время
 * @param {number} daysThreshold - Количество дней для определения "старых" изображений
 * @returns {Array} - Массив старых изображений
 */
export const getOldImages = (daysThreshold = 30) => {
  try {
    const savedImages = getStoredImages();
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() - daysThreshold);
    
    return savedImages.filter(img => {
      const lastAccessed = new Date(img.lastAccessed || img.uploadDate);
      return lastAccessed < thresholdDate;
    });
  } catch (error) {
    console.error('Ошибка при получении старых изображений:', error);
    return [];
  }
}; 