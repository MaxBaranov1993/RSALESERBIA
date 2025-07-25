import React, { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

// Стили для компонентов
const STYLES = {
  container: "min-h-screen flex flex-col justify-center py-16 sm:px-6 lg:px-8 relative overflow-hidden",
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
      <p className="mt-2 text-sm text-red-600 font-medium">{error}</p>
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
          {t('login.title')}
        </h2>
        <p className={STYLES.header.subtitle}>
          {t('login.subtitle')}
        </p>
      </div>
    </div>
  );
});

FormHeader.displayName = 'FormHeader';

// Основной компонент входа
const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useLanguage();
  const { login } = useAuth();
  const navigate = useNavigate();

  // Обработка изменений в форме
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

    if (!formData.email.trim()) {
      newErrors.email = t('login.validation.emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('login.validation.emailInvalid');
    }

    if (!formData.password) {
      newErrors.password = t('login.validation.passwordRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, t]);

  // Обработка отправки формы
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        const result = await login(formData.email, formData.password);
        if (result.success) {
          navigate('/');
        } else {
          setErrors({ general: result.error });
        }
      } catch (error) {
        setErrors({ general: error.message });
      } finally {
        setIsSubmitting(false);
      }
    }
  }, [formData, validateForm, login, navigate]);

  return (
    <div className={`${STYLES.container} py-8`}>
      <BackgroundDecorations />
      <FormHeader />
      
      <div className={STYLES.form.wrapper}>
        <div className={STYLES.form.container}>
          <form className={STYLES.form.field} onSubmit={handleSubmit}>
            {/* Email */}
            <FormField
              id="email"
              name="email"
              type="email"
              label={t('login.email')}
              placeholder="example@email.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              required={true}
            />

            {/* Пароль */}
            <FormField
              id="password"
              name="password"
              type="password"
              label={t('login.password')}
              placeholder={t('login.passwordPlaceholder')}
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              required={true}
            />

            {/* Общая ошибка */}
            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-sm text-red-600">{errors.general}</p>
              </div>
            )}

            {/* Кнопка входа */}
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
                  t('login.submit')
                )}
              </button>
            </div>

            {/* Ссылка на регистрацию */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                {t('login.noAccount')}{' '}
                <Link 
                  to="/register" 
                  className={STYLES.link}
                >
                  {t('login.registerLink')}
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login; 