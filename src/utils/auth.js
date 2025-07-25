// Простая реализация JWT для демонстрации
// В реальном проекте используйте библиотеку jsonwebtoken

// Генерируем простой JWT токен
export const generateToken = (payload) => {
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };
  
  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify(payload));
  
  // Простая подпись для демонстрации
  const signature = btoa('demo-secret-key');
  
  return `${encodedHeader}.${encodedPayload}.${signature}`;
};

// Проверяем JWT токен
export const verifyToken = (token) => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }
    
    const payload = JSON.parse(atob(parts[1]));
    return payload;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
};

// Сохраняем токен в localStorage
export const saveToken = (token) => {
  localStorage.setItem('authToken', token);
};

// Получаем токен из localStorage
export const getToken = () => {
  return localStorage.getItem('authToken');
};

// Удаляем токен
export const removeToken = () => {
  localStorage.removeItem('authToken');
};

// Проверяем, авторизован ли пользователь
export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;
  
  const payload = verifyToken(token);
  return payload !== null;
};

// Получаем данные пользователя из токена
export const getCurrentUser = () => {
  const token = getToken();
  if (!token) return null;
  
  return verifyToken(token);
}; 