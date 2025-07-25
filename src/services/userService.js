import { usersData } from '../data/usersData';
import { generateToken, saveToken } from '../utils/auth';

// Получаем всех пользователей
export const getAllUsers = () => {
  return usersData;
};

// Получаем пользователя по ID
export const getUserById = (id) => {
  return usersData.find(user => user.id === id);
};

// Получаем пользователя по email
export const getUserByEmail = (email) => {
  return usersData.find(user => user.email === email);
};

// Получаем пользователя по username
export const getUserByUsername = (username) => {
  return usersData.find(user => user.username === username);
};

// Генерируем уникальный ID
const generateUniqueId = () => {
  const existingIds = usersData.map(user => user.id);
  let newId = Math.max(...existingIds) + 1;
  return newId;
};

// Генерируем username на основе имени и фамилии
const generateUsername = (firstName, lastName) => {
  const baseUsername = `${firstName.toLowerCase()}_${lastName.toLowerCase()}`;
  let username = baseUsername;
  let counter = 1;
  
  // Проверяем, существует ли такой username
  while (getUserByUsername(username)) {
    username = `${baseUsername}_${counter}`;
    counter++;
  }
  
  return username;
};

// Генерируем аватар по умолчанию
const generateDefaultAvatar = (firstName, lastName) => {
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  const colors = [
    'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 
    'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-gray-500'
  ];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(firstName + ' ' + lastName)}&background=${randomColor.replace('bg-', '').replace('-500', '')}&color=fff&size=150`;
};

// Регистрация нового пользователя
export const registerUser = async (userData) => {
  try {
    // Проверяем, что email не занят
    if (getUserByEmail(userData.email)) {
      throw new Error('Пользователь с таким email уже существует');
    }

    // Проверяем, что username не занят
    if (getUserByUsername(userData.username)) {
      throw new Error('Пользователь с таким именем уже существует');
    }

    // Создаем нового пользователя
    const newUser = {
      id: generateUniqueId(),
      username: userData.username || generateUsername(userData.firstName, userData.lastName),
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      phone: userData.phone || '',
      avatar: userData.avatar || generateDefaultAvatar(userData.firstName, userData.lastName),
      location: {
        city: userData.city || 'Не указан',
        country: userData.country || 'Россия',
        coordinates: {
          lat: 0,
          lng: 0
        }
      },
      rating: 0,
      reviewsCount: 0,
      joinDate: new Date().toISOString().split('T')[0],
      isVerified: false,
      productsCount: 0,
      favoritesCount: 0,
      bio: userData.bio || 'Новый пользователь'
    };

    // В реальном проекте здесь был бы запрос к API
    // Для демонстрации добавляем в массив
    usersData.push(newUser);

    // Генерируем JWT токен
    const token = generateToken({
      id: newUser.id,
      email: newUser.email,
      username: newUser.username,
      firstName: newUser.firstName,
      lastName: newUser.lastName
    });

    // Сохраняем токен
    saveToken(token);

    return {
      user: newUser,
      token
    };
  } catch (error) {
    throw error;
  }
};

// Авторизация пользователя
export const loginUser = async (email, password) => {
  try {
    // В реальном проекте здесь была бы проверка пароля
    // Для демонстрации просто ищем пользователя по email
    const user = getUserByEmail(email);
    
    if (!user) {
      throw new Error('Пользователь не найден');
    }

    // Генерируем JWT токен
    const token = generateToken({
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName
    });

    // Сохраняем токен
    saveToken(token);

    return {
      user,
      token
    };
  } catch (error) {
    throw error;
  }
};

// Обновляем данные пользователя
export const updateUser = async (userId, updates) => {
  try {
    const userIndex = usersData.findIndex(user => user.id === userId);
    
    if (userIndex === -1) {
      throw new Error('Пользователь не найден');
    }

    // Обновляем данные пользователя
    usersData[userIndex] = {
      ...usersData[userIndex],
      ...updates
    };

    return usersData[userIndex];
  } catch (error) {
    throw error;
  }
};

// Добавляем товар пользователю
export const addProductToUser = async (userId, product) => {
  try {
    const userIndex = usersData.findIndex(user => user.id === userId);
    
    if (userIndex === -1) {
      throw new Error('Пользователь не найден');
    }

    // Увеличиваем количество товаров
    usersData[userIndex].productsCount += 1;

    return usersData[userIndex];
  } catch (error) {
    throw error;
  }
}; 