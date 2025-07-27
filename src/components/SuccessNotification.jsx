import { useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

function SuccessNotification({ isVisible, onClose, productType }) {
  const { t } = useLanguage();

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000); // Автоматически скрыть через 5 секунд

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg max-w-sm">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium">
              {productType === 'service' 
                ? t('notification.serviceAdded')
                : t('notification.productAdded')
              }
            </p>
            <p className="text-xs opacity-90 mt-1">
              {t('notification.viewInProfile')}
            </p>
          </div>
          <div className="ml-auto pl-3">
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SuccessNotification; 