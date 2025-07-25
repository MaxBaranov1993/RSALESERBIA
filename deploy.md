# Деплой на Vercel

## Подготовка к деплою

### 1. Убедитесь, что проект готов к продакшену:
```bash
npm run build
```

### 2. Проверьте, что все зависимости установлены:
```bash
npm install
```

### 3. Убедитесь, что все файлы закоммичены в Git:
```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

## Деплой на Vercel

### Способ 1: Через Vercel Dashboard
1. Зайдите на [vercel.com](https://vercel.com)
2. Создайте новый проект
3. Подключите ваш GitHub репозиторий
4. Vercel автоматически определит настройки для React приложения
5. Нажмите "Deploy"

### Способ 2: Через Vercel CLI
```bash
# Установите Vercel CLI
npm i -g vercel

# Войдите в аккаунт
vercel login

# Деплой
vercel

# Для продакшена
vercel --prod
```

## Конфигурация

### vercel.json
Файл `vercel.json` уже настроен для:
- Правильной сборки React приложения
- Маршрутизации для SPA (Single Page Application)
- Обслуживания статических файлов

### Переменные окружения
При необходимости добавьте переменные окружения в настройках проекта на Vercel:
- `REACT_APP_API_URL`
- `REACT_APP_ENVIRONMENT`
- `REACT_APP_VERSION`

## Структура проекта для деплоя

```
marketplace/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   ├── manifest.json
│   ├── robots.txt
│   └── logo*.png
├── src/
│   ├── components/
│   ├── pages/
│   ├── context/
│   ├── data/
│   ├── services/
│   ├── utils/
│   ├── locales/
│   └── assets/
├── package.json
├── vercel.json
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## Возможные проблемы

### 1. Ошибки сборки
- Проверьте, что все импорты корректны
- Убедитесь, что все зависимости указаны в `package.json`

### 2. Проблемы с маршрутизацией
- Убедитесь, что `vercel.json` настроен правильно
- Проверьте, что все роуты работают в продакшене

### 3. Проблемы с изображениями
- Убедитесь, что все изображения находятся в папке `public/`
- Проверьте пути к изображениям в коде

## Мониторинг

После деплоя:
1. Проверьте все страницы приложения
2. Убедитесь, что авторизация работает
3. Проверьте мобильную версию
4. Протестируйте все основные функции 