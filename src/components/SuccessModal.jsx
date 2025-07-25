import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const SuccessModal = ({ isOpen, onClose, userData }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = React.useState(5);

  // Автоматическое закрытие через 5 секунд
  React.useEffect(() => {
    if (isOpen) {
      setTimeLeft(5);
      const timer = setTimeout(() => {
        onClose();
        navigate('/profile');
      }, 5000);

      const countdown = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(countdown);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        clearTimeout(timer);
        clearInterval(countdown);
      };
    }
  }, [isOpen, onClose, navigate]);

  if (!isOpen) return null;

  const handleContinue = () => {
    onClose();
    navigate('/profile');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl transform transition-all">
        {/* Иконка успеха */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <svg 
              className="w-8 h-8 text-green-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5 13l4 4L19 7" 
              />
            </svg>
          </div>
        </div>

        {/* Заголовок */}
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {t('register.success.title')}
          </h3>
          <p className="text-gray-600">
            {t('register.success.message')}
          </p>
        </div>

        {/* Информация о пользователе */}
        {userData && (
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-violet-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-violet-600 font-semibold text-lg">
                  {userData.firstName?.charAt(0) || userData.username?.charAt(0) || 'U'}
                </span>
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  {userData.firstName} {userData.lastName}
                </p>
                <p className="text-sm text-gray-600">
                  {userData.email}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Кнопка перехода в профиль */}
        <div>
          <button
            onClick={handleContinue}
            className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
          >
            {t('register.success.continue')}
          </button>
        </div>

        {/* Дополнительная информация */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            {t('register.success.welcomeMessage')}
          </p>
          <p className="text-xs text-gray-400 mt-2">
            {t('register.success.autoRedirect', { seconds: timeLeft })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal; 