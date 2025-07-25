import React, { useState, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import SuccessModal from '../components/SuccessModal';

// Константы для валидации
const VALIDATION_RULES = {
  firstName: {
    required: true,
    message: 'Имя обязательно'
  },
  lastName: {
    required: true,
    message: 'Фамилия обязательна'
  },
  email: {
    required: true,
    pattern: /\S+@\S+\.\S+/,
    message: 'Введите корректный email'
  },

  password: {
    required: true,
    minLength: 6,
    message: 'Пароль должен содержать минимум 6 символов'
  },
  confirmPassword: {
    required: true,
    message: 'Подтвердите пароль'
  }
};

// Начальное состояние формы
const INITIAL_FORM_STATE = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  city: '',
  bio: '',
  password: '',
  confirmPassword: ''
};

// Стили для компонентов
const STYLES = {
  container: "min-h-screen flex flex-col justify-center py-16 sm:px-6 lg:px-8 relative overflow-hidden pb-20 md:pb-16",
  background: {
    wrapper: "absolute inset-0 overflow-hidden",
    element1: "absolute -top-40 -right-40 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl",
    element2: "absolute -bottom-40 -left-40 w-80 h-80 bg-orange-400/20 rounded-full blur-3xl",
    element3: "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl"
  },
  header: {
    wrapper: "sm:mx-auto sm:w-full sm:max-w-md relative z-10",
    title: "text-4xl font-bold text-gray-900 mb-3",
    subtitle: "text-gray-600 text-lg"
  },
  form: {
    wrapper: "mt-10 sm:mx-auto sm:w-full sm:max-w-md relative z-10",
    container: "bg-white/90 backdrop-blur-xl py-10 px-6 shadow-2xl rounded-3xl sm:px-12 border border-white/30",
    field: "space-y-8"
  },
  input: {
    base: "w-full px-5 py-4 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-600 transition-all duration-200 bg-white/70 backdrop-blur-sm text-lg",
    error: "border-red-500",
    normal: "border-gray-200"
  },
  button: {
    submit: "w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 shadow-xl hover:shadow-2xl transform hover:scale-[1.02] text-lg"
  },
  link: "font-semibold text-violet-600 hover:text-violet-500 transition-colors duration-200"
};

// Компонент для поля ввода
const FormField = React.memo(({ 
  id, 
  name, 
  type = "text", 
  label, 
  placeholder, 
  value, 
  onChange, 
  error, 
  required = false 
}) => (
  <div>
    <label htmlFor={id} className="block text-base font-semibold text-gray-700 mb-3">
      {label}
    </label>
    <input
      id={id}
      name={name}
      type={type}
      required={required}
      value={value}
      onChange={onChange}
      className={`${STYLES.input.base} ${error ? STYLES.input.error : STYLES.input.normal}`}
      placeholder={placeholder}
    />
    {error && (
      <p className="mt-1 text-sm text-red-600">{error}</p>
    )}
  </div>
));

FormField.displayName = 'FormField';

// Компонент для декоративных элементов фона
const BackgroundDecorations = React.memo(() => (
  <div className={STYLES.background.wrapper}>
    <div className={STYLES.background.element1}></div>
    <div className={STYLES.background.element2}></div>
    <div className={STYLES.background.element3}></div>
  </div>
));

BackgroundDecorations.displayName = 'BackgroundDecorations';

// Компонент заголовка
const FormHeader = React.memo(() => {
  const { t } = useLanguage();
  return (
    <div className={STYLES.header.wrapper}>
      <div className="text-center">
        <h2 className={STYLES.header.title}>
          {t('register.title')}
        </h2>
        <p className={STYLES.header.subtitle}>
          {t('register.subtitle')}
        </p>
      </div>
    </div>
  );
});

FormHeader.displayName = 'FormHeader';

// Основной компонент регистрации
const Register = () => {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [registeredUser, setRegisteredUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useLanguage();
  const { register } = useAuth();
  const navigate = useNavigate();

  // Мемоизированная функция обработки изменений
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Очищаем ошибку при вводе
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  }, [errors]);

  // Валидация формы
  const validateForm = useCallback(() => {
    const newErrors = {};

    // Валидация имени
    if (VALIDATION_RULES.firstName.required && !formData.firstName.trim()) {
      newErrors.firstName = VALIDATION_RULES.firstName.message;
    }

    // Валидация фамилии
    if (VALIDATION_RULES.lastName.required && !formData.lastName.trim()) {
      newErrors.lastName = VALIDATION_RULES.lastName.message;
    }

    // Валидация email
    if (VALIDATION_RULES.email.required && !formData.email.trim()) {
      newErrors.email = 'Email обязателен';
    } else if (formData.email && !VALIDATION_RULES.email.pattern.test(formData.email)) {
      newErrors.email = VALIDATION_RULES.email.message;
    }

    // Валидация пароля
    if (VALIDATION_RULES.password.required && !formData.password) {
      newErrors.password = 'Пароль обязателен';
    } else if (formData.password && formData.password.length < VALIDATION_RULES.password.minLength) {
      newErrors.password = VALIDATION_RULES.password.message;
    }

    // Валидация подтверждения пароля
    if (VALIDATION_RULES.confirmPassword.required && !formData.confirmPassword) {
      newErrors.confirmPassword = VALIDATION_RULES.confirmPassword.message;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Обработка отправки формы
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        const result = await register(formData);
        if (result.success) {
          setRegisteredUser(result.user);
          setShowSuccessModal(true);
        } else {
          // Обработка ошибки регистрации
          console.error('Ошибка регистрации:', result.error);
          // Здесь можно добавить отображение ошибки пользователю
        }
      } catch (error) {
        console.error('Ошибка при регистрации:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  }, [formData, validateForm, register]);

  // Мемоизированные поля формы
  const formFields = useMemo(() => [
    {
      id: 'firstName',
      name: 'firstName',
      label: t('register.firstName'),
      placeholder: t('register.firstName'),
      value: formData.firstName,
      error: errors.firstName,
      required: true
    },
    {
      id: 'lastName',
      name: 'lastName',
      label: t('register.lastName'),
      placeholder: t('register.lastName'),
      value: formData.lastName,
      error: errors.lastName,
      required: true
    },
    {
      id: 'email',
      name: 'email',
      type: 'email',
      label: t('register.email'),
      placeholder: 'example@email.com',
      value: formData.email,
      error: errors.email,
      required: true
    },
    {
      id: 'password',
      name: 'password',
      type: 'password',
      label: t('register.password'),
      placeholder: t('register.validation.passwordMinLength'),
      value: formData.password,
      error: errors.password,
      required: true
    },
    {
      id: 'confirmPassword',
      name: 'confirmPassword',
      type: 'password',
      label: t('register.confirmPassword'),
      placeholder: t('register.confirmPassword'),
      value: formData.confirmPassword,
      error: errors.confirmPassword,
      required: true
    }
  ], [formData, errors, t]);

  return (
    <div className={`${STYLES.container} py-8`}>
      <BackgroundDecorations />
      <FormHeader />
      
      <div className={STYLES.form.wrapper}>
        <div className={STYLES.form.container}>
          <form className={STYLES.form.field} onSubmit={handleSubmit}>
            {/* Имя и Фамилия */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {formFields.slice(0, 2).map(field => (
                <FormField
                  key={field.id}
                  {...field}
                  onChange={handleChange}
                />
              ))}
            </div>

            {/* Остальные поля */}
            {formFields.slice(2).map(field => (
              <FormField
                key={field.id}
                {...field}
                onChange={handleChange}
              />
            ))}

            {/* Кнопка регистрации */}
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`${STYLES.button.submit} ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {t('common.loading')}
                  </div>
                ) : (
                  t('register.submit')
                )}
              </button>
            </div>

            {/* Ссылка на вход */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                {t('register.alreadyHaveAccount')}{' '}
                <Link 
                  to="/login" 
                  className={STYLES.link}
                >
                  {t('register.loginLink')}
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Модальное окно успешной регистрации */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        userData={registeredUser}
      />
    </div>
  );
};

export default Register; 