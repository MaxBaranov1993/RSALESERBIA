import React, { useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

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
  password: '',
  confirmPassword: ''
};

// Стили для компонентов
const STYLES = {
  container: "min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden",
  background: {
    wrapper: "absolute inset-0 overflow-hidden",
    element1: "absolute -top-40 -right-40 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl",
    element2: "absolute -bottom-40 -left-40 w-80 h-80 bg-orange-400/20 rounded-full blur-3xl",
    element3: "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl"
  },
  header: {
    wrapper: "sm:mx-auto sm:w-full sm:max-w-md relative z-10",
    title: "text-3xl font-bold text-gray-900 mb-2",
    subtitle: "text-gray-600"
  },
  form: {
    wrapper: "mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10",
    container: "bg-white/80 backdrop-blur-xl py-8 px-4 shadow-2xl rounded-2xl sm:px-10 border border-white/20",
    field: "space-y-6"
  },
  input: {
    base: "w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-600 transition-all duration-200 bg-white/50 backdrop-blur-sm",
    error: "border-red-500",
    normal: "border-gray-200"
  },
  button: {
    submit: "w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
  },
  link: "font-medium text-orange-600 hover:text-orange-500 transition"
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
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
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
  const { t } = useLanguage();

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
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (validateForm()) {
      // Здесь будет логика отправки данных на сервер
      console.log('Форма отправлена:', formData);
    }
  }, [formData, validateForm]);

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
              className={STYLES.button.submit}
            >
              {t('register.submit')}
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
    </div>
  );
};

export default Register; 