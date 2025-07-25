import { productsData } from './productsData.js';
import { usersData } from './usersData.js';

// Привязываем товары к пользователям
export const userProductsData = [
  // Иван Петров (ID: 1) - электроника и товары
  {
    ...productsData[0], // iPhone 14 Pro
    sellerId: 1,
    sellerName: "Иван Петров",
    sellerUsername: "ivan_petrov"
  },
  {
    ...productsData[19], // iPad Pro
    sellerId: 1,
    sellerName: "Иван Петров", 
    sellerUsername: "ivan_petrov"
  },

  // Мария Иванова (ID: 2) - одежда и аксессуары
  {
    ...productsData[8], // Куртка зимняя North Face
    sellerId: 2,
    sellerName: "Мария Иванова",
    sellerUsername: "maria_ivanova"
  },
  {
    ...productsData[21], // Кожаная куртка мужская
    sellerId: 2,
    sellerName: "Мария Иванова",
    sellerUsername: "maria_ivanova"
  },

  // Алексей Кузнецов (ID: 3) - электроника и компьютеры
  {
    ...productsData[1], // MacBook Air M2
    sellerId: 3,
    sellerName: "Алексей Кузнецов",
    sellerUsername: "alex_kuznetsov"
  },
  {
    ...productsData[20], // Sony WH-1000XM5
    sellerId: 3,
    sellerName: "Алексей Кузнецов",
    sellerUsername: "alex_kuznetsov"
  },

  // Елена Смирнова (ID: 4) - мебель и интерьер
  {
    ...productsData[10], // Диван угловой IKEA
    sellerId: 4,
    sellerName: "Елена Смирнова",
    sellerUsername: "elena_smirnova"
  },
  {
    ...productsData[24], // Диван угловой
    sellerId: 4,
    sellerName: "Елена Смирнова",
    sellerUsername: "elena_smirnova"
  },

  // Дмитрий Волков (ID: 5) - автозапчасти и услуги
  {
    ...productsData[16], // Ремонт компьютеров
    sellerId: 5,
    sellerName: "Дмитрий Волков",
    sellerUsername: "dmitry_volkov"
  },
  {
    ...productsData[30], // Кофемашина DeLonghi
    sellerId: 5,
    sellerName: "Дмитрий Волков",
    sellerUsername: "dmitry_volkov"
  }
];

// Функция для получения товаров пользователя по ID
export const getUserProducts = (userId) => {
  return userProductsData.filter(product => product.sellerId === userId);
};

// Функция для получения пользователя по ID
export const getUserById = (userId) => {
  return usersData.find(user => user.id === userId);
};

// Функция для получения полной информации о товаре с данными продавца
export const getProductWithSeller = (productId) => {
  const product = userProductsData.find(p => p.id === productId);
  if (!product) return null;
  
  const seller = getUserById(product.sellerId);
  return {
    ...product,
    seller
  };
};

// Функция для получения всех товаров с информацией о продавцах
export const getAllProductsWithSellers = () => {
  return userProductsData.map(product => {
    const seller = getUserById(product.sellerId);
    return {
      ...product,
      seller
    };
  });
};

export default userProductsData; 