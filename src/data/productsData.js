// Реальные адреса из Белграда и Нови Сада
const belgradeAddresses = [
  { street: "Кнез Михаилова", houseNumber: "15" },
  { street: "Теразије", houseNumber: "22" },
  { street: "Скадарска", houseNumber: "8" },
  { street: "Дорћол", houseNumber: "12" },
  { street: "Новосадска", houseNumber: "45" },
  { street: "Булевар ослобођења", houseNumber: "67" },
  { street: "Булевар краља Александра", houseNumber: "89" },
  { street: "Врачар", houseNumber: "34" },
  { street: "Земун", houseNumber: "56" },
  { street: "Нови Београд", houseNumber: "78" },
  { street: "Савски венац", houseNumber: "23" },
  { street: "Стари град", houseNumber: "11" },
  { street: "Палилула", houseNumber: "90" },
  { street: "Звездара", houseNumber: "44" },
  { street: "Вождовац", houseNumber: "33" },
  { street: "Раковица", houseNumber: "55" },
  { street: "Чукарица", houseNumber: "77" },
  { street: "Барајево", houseNumber: "99" },
  { street: "Гроцка", houseNumber: "21" },
  { street: "Обреновац", houseNumber: "43" }
];

const noviSadAddresses = [
  { street: "Дунавска", houseNumber: "8" },
  { street: "Змај Јовина", houseNumber: "16" },
  { street: "Мише Димитријевића", houseNumber: "24" },
  { street: "Булевар ослобођења", houseNumber: "32" },
  { street: "Булевар Михајла Пупина", houseNumber: "40" },
  { street: "Булевар Јаше Томића", houseNumber: "48" },
  { street: "Булевар Десанке Максимовић", houseNumber: "56" },
  { street: "Булевар Патријарха Павла", houseNumber: "64" },
  { street: "Булевар Војводе Степе", houseNumber: "72" },
  { street: "Булевар краља Петра I", houseNumber: "80" },
  { street: "Булевар краља Александра", houseNumber: "88" },
  { street: "Булевар Николе Тесле", houseNumber: "96" },
  { street: "Булевар цара Лазара", houseNumber: "104" },
  { street: "Булевар краља Милана", houseNumber: "112" },
  { street: "Булевар краља Петра II", houseNumber: "120" },
  { street: "Булевар краља Александра I", houseNumber: "128" },
  { street: "Булевар краља Милана Обреновића", houseNumber: "136" },
  { street: "Булевар краља Петра I Карађорђевића", houseNumber: "144" },
  { street: "Булевар краља Александра I Карађорђевића", houseNumber: "152" },
  { street: "Булевар краља Милана Обреновића", houseNumber: "160" }
];

// Функция для получения случайного адреса
const getRandomAddress = (city) => {
  if (city === "Белград" || city === "Belgrade") {
    return belgradeAddresses[Math.floor(Math.random() * belgradeAddresses.length)];
  } else if (city === "Нови Сад" || city === "Novi Sad") {
    return noviSadAddresses[Math.floor(Math.random() * noviSadAddresses.length)];
  }
  return { street: "Главна", houseNumber: "1" };
};

export const productsData = [
  // Электроника
  {
    id: 1,
    title: "iPhone 14 Pro 128GB",
    price: 899,
    city: "Белград",
    street: "Кнез Михаилова",
    houseNumber: "15",
    sellerName: "Александр Петров",
    photo: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop",
    photos: [
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop&crop=entropy"
    ],
    category: "electronics",
    description: "Отличное состояние, куплен 6 месяцев назад. Полный комплект, гарантия до конца года. Телефон в идеальном состоянии, без царапин и повреждений. Продаю из-за перехода на новую модель. В комплекте: телефон, зарядное устройство, кабель, инструкция, коробка.",
    condition: "excellent",
    views: 156,
    favorites: 23,
    date: "2024-01-15"
  },
  {
    id: 2,
    title: "MacBook Air M2 13\"",
    price: 1299,
    city: "Нови Сад",
    street: "Змај Јовина",
    houseNumber: "16",
    sellerName: "Мария Иванова",
    photo: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop",
    photos: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop&crop=entropy"
    ],
    category: "electronics",
    description: "Новый MacBook Air с чипом M2. 8GB RAM, 256GB SSD. Идеально для работы и учебы. Ноутбук в отличном состоянии, без царапин. Продаю из-за покупки более мощной модели. В комплекте: ноутбук, зарядное устройство, инструкция, коробка.",
    condition: "new",
    views: 89,
    favorites: 15,
    date: "2024-01-14"
  },
  {
    id: 3,
    title: "Samsung Galaxy S23",
    price: 699,
    city: "Белград",
    street: "Скадарска",
    houseNumber: "8",
    sellerName: "Дмитрий Сидоров",
    photo: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop",
    photos: [
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop&crop=entropy"
    ],
    category: "electronics",
    description: "Отличный телефон, 256GB, черный цвет. Продаю из-за перехода на iPhone. Телефон в идеальном состоянии, без царапин и повреждений. В комплекте: телефон, зарядное устройство, кабель, защитное стекло, чехол.",
    condition: "excellent",
    views: 234,
    favorites: 31,
    date: "2024-01-13"
  },
  {
    id: 19,
    title: "iPad Pro 12.9\" 2023",
    price: 1099,
    city: "Белград",
    street: "Дорћол",
    houseNumber: "12",
    sellerName: "Елена Козлова",
    photo: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop",
    photos: [
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop&crop=entropy",
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop&crop=center"
    ],
    category: "electronics",
    description: "Новый iPad Pro с чипом M2, 256GB, Wi-Fi. Идеально для творчества и работы. Планшет в отличном состоянии, без царапин. Продаю из-за покупки ноутбука. В комплекте: планшет, зарядное устройство, кабель, стилус Apple Pencil.",
    condition: "new",
    views: 123,
    favorites: 18,
    date: "2024-01-08"
  },
  {
    id: 20,
    title: "Sony WH-1000XM5",
    price: 299,
    city: "Нови Сад",
    street: "Мише Димитријевића",
    houseNumber: "24",
    sellerName: "Андрей Соколов",
    photo: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
    photos: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop&crop=entropy",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop&crop=center"
    ],
    category: "electronics",
    description: "Беспроводные наушники с шумоподавлением. Отличное качество звука. Наушники в идеальном состоянии, без царапин. Продаю из-за покупки новых. В комплекте: наушники, чехол, кабель, инструкция.",
    condition: "excellent",
    views: 89,
    favorites: 12,
    date: "2024-01-07"
  },

  // Недвижимость
  {
    id: 4,
    title: "2-комнатная квартира в центре",
    price: 185000,
    city: "Белград",
    street: "Новосадска",
    houseNumber: "45",
    sellerName: "Агентство 'Дом'",
    photo: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop",
    photos: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop&crop=entropy",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop&crop=center"
    ],
    category: "estate",
    description: "Современная квартира 65м², 2 спальни, балкон, подземная парковка. Район Дорчол. Квартира в отличном состоянии, недавно отремонтирована. Есть вся необходимая мебель и техника. Идеально для семьи или инвестиций.",
    condition: "new",
    views: 567,
    favorites: 89,
    date: "2024-01-12"
  },
  {
    id: 5,
    title: "Дом с участком 200м²",
    price: 450000,
    city: "Земун",
    street: "Земун",
    houseNumber: "56",
    sellerName: "Петр Николаев",
    photo: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop",
    photos: [
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop&crop=entropy",
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop&crop=center"
    ],
    category: "estate",
    description: "Красивый дом с садом, 3 спальни, гараж на 2 машины. Тихий район, хорошие соседи. Дом в отличном состоянии, недавно отремонтирован. Есть вся необходимая мебель и техника. Идеально для семьи.",
    condition: "excellent",
    views: 423,
    favorites: 67,
    date: "2024-01-11"
  },

  // Транспорт
  {
    id: 6,
    title: "Toyota Corolla 2020",
    price: 18500,
    city: "Белград",
    street: "Булевар ослобођења",
    houseNumber: "67",
    sellerName: "Михаил Козлов",
    photo: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop",
    photos: [
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop&crop=entropy",
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop&crop=center"
    ],
    category: "cars",
    description: "Автомат, бензин, 45000 км, полная история обслуживания. Первый владелец. Автомобиль в отличном состоянии, без повреждений. Продаю из-за покупки новой модели. В комплекте: автомобиль, документы, сервисная книжка.",
    condition: "excellent",
    views: 789,
    favorites: 124,
    date: "2024-01-10"
  },
  {
    id: 33,
    title: "BMW X5 2019",
    price: 45000,
    city: "Белград",
    street: "Булевар краља Александра",
    houseNumber: "89",
    sellerName: "Алексей Волков",
    photo: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop",
    photos: [
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop&crop=entropy",
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop&crop=center"
    ],
    category: "cars",
    description: "Дизель, автомат, 78000 км, полный привод, кожаный салон. Автомобиль в отличном состоянии, регулярное обслуживание. Продаю из-за переезда. В комплекте: автомобиль, документы, сервисная книжка, дополнительный ключ.",
    condition: "excellent",
    views: 456,
    favorites: 89,
    date: "2024-01-05"
  },
  {
    id: 34,
    title: "Mercedes C-Class 2021",
    price: 32000,
    city: "Нови Сад",
    street: "Булевар ослобођења",
    houseNumber: "32",
    sellerName: "Дмитрий Соколов",
    photo: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400&h=300&fit=crop",
    photos: [
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400&h=300&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400&h=300&fit=crop&crop=entropy",
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400&h=300&fit=crop&crop=center"
    ],
    category: "cars",
    description: "Бензин, автомат, 35000 км, премиум комплектация. Автомобиль в идеальном состоянии, первый владелец. Продаю из-за покупки более крупной модели. В комплекте: автомобиль, документы, сервисная книжка.",
    condition: "excellent",
    views: 678,
    favorites: 156,
    date: "2024-01-03"
  },
  {
    id: 35,
    title: "Audi A4 2018",
    price: 22000,
    city: "Белград",
    street: "Врачар",
    houseNumber: "34",
    sellerName: "Игорь Петров",
    photo: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=300&fit=crop",
    photos: [
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=300&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=300&fit=crop&crop=entropy",
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=300&fit=crop&crop=center"
    ],
    category: "cars",
    description: "Дизель, автомат, 95000 км, quattro, спортивный пакет. Автомобиль в хорошем состоянии, регулярное обслуживание. Продаю из-за покупки новой модели. В комплекте: автомобиль, документы, сервисная книжка.",
    condition: "good",
    views: 345,
    favorites: 67,
    date: "2023-12-30"
  },
  {
    id: 36,
    title: "Volkswagen Golf 2020",
    price: 16500,
    city: "Нови Сад",
    street: "Булевар Михајла Пупина",
    houseNumber: "40",
    sellerName: "Мария Иванова",
    photo: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=300&fit=crop",
    photos: [
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=300&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=300&fit=crop&crop=entropy",
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=300&fit=crop&crop=center"
    ],
    category: "cars",
    description: "Бензин, автомат, 42000 км, полная комплектация. Автомобиль в отличном состоянии, первый владелец. Продаю из-за покупки более крупной модели. В комплекте: автомобиль, документы, сервисная книжка.",
    condition: "excellent",
    views: 234,
    favorites: 45,
    date: "2023-12-25"
  },
  {
    id: 37,
    title: "Skoda Octavia 2019",
    price: 14500,
    city: "Белград",
    street: "Стари град",
    houseNumber: "11",
    sellerName: "Андрей Медведев",
    photo: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=300&fit=crop",
    photos: [
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=300&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=300&fit=crop&crop=entropy",
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=300&fit=crop&crop=center"
    ],
    category: "cars",
    description: "Дизель, механика, 68000 км, просторный салон. Автомобиль в хорошем состоянии, регулярное обслуживание. Продаю из-за переезда. В комплекте: автомобиль, документы, сервисная книжка.",
    condition: "good",
    views: 189,
    favorites: 32,
    date: "2023-12-20"
  },
  {
    id: 7,
    title: "Велосипед горный Trek",
    price: 450,
    city: "Нови Сад",
    street: "Булевар Јаше Томића",
    houseNumber: "48",
    sellerName: "Анна Смирнова",
    photo: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=300&fit=crop",
    photos: [
      "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=300&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=300&fit=crop&crop=entropy",
      "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=300&fit=crop&crop=center"
    ],
    category: "goods",
    description: "Отличный горный велосипед, 21 скорость, амортизаторы. Подходит для активного отдыха. Велосипед в хорошем состоянии, без повреждений. Продаю из-за покупки нового. В комплекте: велосипед, насос, замок.",
    condition: "good",
    views: 156,
    favorites: 28,
    date: "2024-01-09"
  },

  // Одежда и обувь
  {
    id: 8,
    title: "Куртка зимняя North Face",
    price: 180,
    city: "Белград",
    street: "Палилула",
    houseNumber: "90",
    sellerName: "Елена Воробьева",
    photo: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=300&fit=crop",
    photos: [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=300&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=300&fit=crop&crop=entropy",
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=300&fit=crop&crop=center"
    ],
    category: "clothes",
    description: "Теплая зимняя куртка, размер M, черный цвет. Носил один сезон. Куртка в отличном состоянии, без повреждений. Продаю из-за переезда. В комплекте: куртка, подкладка.",
    condition: "good",
    views: 234,
    favorites: 45,
    date: "2024-01-08"
  },
  {
    id: 9,
    title: "Кроссовки Nike Air Max",
    price: 95,
    city: "Белград",
    street: "Звездара",
    houseNumber: "44",
    sellerName: "Сергей Морозов",
    photo: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop",
    photos: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop&crop=entropy",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop&crop=center"
    ],
    category: "clothes",
    description: "Кроссовки Nike Air Max 270, размер 42, белый цвет. Очень удобные для спорта. Кроссовки в отличном состоянии, без повреждений. Продаю из-за покупки новых. В комплекте: кроссовки, коробка.",
    condition: "excellent",
    views: 189,
    favorites: 32,
    date: "2024-01-07"
  },

  // Мебель
  {
    id: 10,
    title: "Диван угловой IKEA",
    price: 350,
    city: "Нови Сад",
    sellerName: "Ольга Ковалева",
    photo: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop",
    photos: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop&crop=entropy",
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop&crop=center"
    ],
    category: "furniture",
    description: "Удобный угловой диван, серый цвет, спальное место. Отлично подходит для гостиной. Диван в хорошем состоянии, без повреждений. Продаю из-за переезда. В комплекте: диван, подушки.",
    condition: "good",
    views: 267,
    favorites: 41,
    date: "2024-01-06"
  },
  {
    id: 11,
    title: "Стол письменный деревянный",
    price: 120,
    city: "Белград",
    sellerName: "Андрей Соколов",
    photo: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
    photos: [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop&crop=entropy",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop&crop=center"
    ],
    category: "furniture",
    description: "Красивый деревянный стол для работы или учебы. Есть ящики для хранения. Стол в отличном состоянии, без повреждений. Продаю из-за покупки нового. В комплекте: стол, стул.",
    condition: "excellent",
    views: 145,
    favorites: 23,
    date: "2024-01-05"
  },

  // Спорт и хобби
  {
    id: 12,
    title: "Гитара акустическая Yamaha",
    price: 280,
    city: "Белград",
    sellerName: "Игорь Лебедев",
    photo: "https://images.unsplash.com/photo-1525201548942-d8732f6617a0?w=400&h=300&fit=crop",
    photos: [
      "https://images.unsplash.com/photo-1525201548942-d8732f6617a0?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1525201548942-d8732f6617a0?w=400&h=300&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1525201548942-d8732f6617a0?w=400&h=300&fit=crop&crop=entropy",
      "https://images.unsplash.com/photo-1525201548942-d8732f6617a0?w=400&h=300&fit=crop&crop=center"
    ],
    category: "goods",
    description: "Отличная акустическая гитара для начинающих. В комплекте чехол и медиатор. Гитара в хорошем состоянии, без повреждений. Продаю из-за покупки новой. В комплекте: гитара, чехол, медиатор, струны.",
    condition: "good",
    views: 178,
    favorites: 29,
    date: "2024-01-04"
  },
  {
    id: 13,
    title: "Беговая дорожка ProForm",
    price: 650,
    city: "Земун",
    sellerName: "Наталья Романова",
    photo: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
    photos: [
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&crop=entropy",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&crop=center"
    ],
    category: "goods",
    description: "Профессиональная беговая дорожка, складывается, много программ тренировок. Дорожка в отличном состоянии, без повреждений. Продаю из-за переезда. В комплекте: дорожка, инструкция, ключ.",
    condition: "excellent",
    views: 312,
    favorites: 56,
    date: "2024-01-03"
  },

  // Услуги
  {
    id: 14,
    title: "Репетитор по математике",
    price: 25,
    city: "Белград",
    sellerName: "Анна Петрова",
    photo: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop",
    photos: [
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop&crop=entropy",
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop&crop=center"
    ],
    category: "services",
    description: "Опытный преподаватель математики. Подготовка к экзаменам, помощь с домашними заданиями. Индивидуальный подход к каждому ученику. Опыт работы 5 лет. Занятия проводятся онлайн или у вас дома.",
    condition: "service",
    views: 89,
    favorites: 12,
    date: "2024-01-02",
    isService: true
  },
  {
    id: 15,
    title: "Уборка квартир и домов",
    price: 40,
    city: "Белград",
    sellerName: "Мария Климова",
    photo: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop",
    photos: [
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop&crop=entropy",
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop&crop=center"
    ],
    category: "services",
    description: "Профессиональная уборка квартир и домов. Использую качественные средства. Опыт работы 3 года. Убираю все виды помещений: квартиры, дома, офисы. Работаю в удобное для вас время.",
    condition: "service",
    views: 156,
    favorites: 34,
    date: "2024-01-01",
    isService: true
  },
  {
    id: 16,
    title: "Ремонт компьютеров",
    price: 30,
    city: "Нови Сад",
    sellerName: "Дмитрий Волков",
    photo: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop",
    photos: [
      "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop&crop=entropy",
      "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop&crop=center"
    ],
    category: "services",
    description: "Ремонт компьютеров и ноутбуков. Диагностика, замена деталей, установка ПО. Опыт работы 8 лет. Ремонтирую все виды техники: ПК, ноутбуки, планшеты. Выезд на дом. Гарантия на работу.",
    condition: "service",
    views: 234,
    favorites: 45,
    date: "2023-12-31",
    isService: true
  },
  {
    id: 17,
    title: "Фотограф для мероприятий",
    price: 150,
    city: "Белград",
    sellerName: "Елена Соколова",
    photo: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400&h=300&fit=crop",
    photos: [
      "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400&h=300&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400&h=300&fit=crop&crop=entropy",
      "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400&h=300&fit=crop&crop=center"
    ],
    category: "services",
    description: "Профессиональная фотосъемка свадеб, дней рождений, корпоративов. Опыт работы 6 лет. Снимаю все виды мероприятий: свадьбы, дни рождения, корпоративы, фотосессии. Обработка фото включена в стоимость.",
    condition: "service",
    views: 189,
    favorites: 28,
    date: "2023-12-30",
    isService: true
  },
  {
    id: 18,
    title: "Курсы английского языка",
    price: 80,
    city: "Белград",
    sellerName: "Алексей Медведев",
    photo: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400&h=300&fit=crop",
    photos: [
      "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400&h=300&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400&h=300&fit=crop&crop=entropy",
      "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400&h=300&fit=crop&crop=center"
    ],
    category: "services",
    description: "Индивидуальные и групповые занятия английским языком. Все уровни. Опыт преподавания 10 лет. Занятия проводятся онлайн или у вас дома. Подготовка к экзаменам, разговорная практика, грамматика.",
    condition: "service",
    views: 267,
    favorites: 52,
    date: "2023-12-29",
    isService: true
  },

  // Одежда
  {
    id: 21,
    title: "Кожаная куртка мужская",
    price: 150,
    city: "Белград",
    sellerName: "Игорь Морозов",
    photo: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=300&fit=crop",
    photos: [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=300&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=300&fit=crop&crop=entropy",
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=300&fit=crop&crop=center"
    ],
    category: "clothes",
    description: "Натуральная кожа, размер L, черный цвет. Отличное состояние. Куртка в идеальном состоянии, без повреждений. Продаю из-за покупки новой. В комплекте: куртка, вешалка.",
    condition: "excellent",
    views: 145,
    favorites: 28,
    date: "2024-01-06"
  },
  {
    id: 22,
    title: "Платье вечернее",
    price: 80,
    city: "Нови Сад",
    sellerName: "Ольга Власова",
    photo: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=300&fit=crop",
    photos: [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=300&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=300&fit=crop&crop=entropy",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=300&fit=crop&crop=center"
    ],
    category: "clothes",
    description: "Элегантное вечернее платье, размер M, темно-синий цвет. Платье в хорошем состоянии, без повреждений. Продаю из-за покупки нового. В комплекте: платье, вешалка.",
    condition: "good",
    views: 98,
    favorites: 15,
    date: "2024-01-05"
  },
  {
    id: 23,
    title: "Джинсы Levi's 501",
    price: 45,
    city: "Белград",
    sellerName: "Денис Ковалев",
    photo: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=300&fit=crop",
    photos: [
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=300&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=300&fit=crop&crop=entropy",
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=300&fit=crop&crop=center"
    ],
    category: "clothes",
    description: "Классические джинсы, размер 32/32, синий цвет. Джинсы в хорошем состоянии, без повреждений. Продаю из-за покупки новых. В комплекте: джинсы.",
    condition: "good",
    views: 76,
    favorites: 8,
    date: "2024-01-04"
  },

  // Мебель
  {
    id: 24,
    title: "Диван угловой",
    price: 450,
    city: "Белград",
    sellerName: "Сергей Попов",
    photo: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop",
    photos: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop&crop=entropy",
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop&crop=center"
    ],
    category: "furniture",
    description: "Удобный угловой диван, серый цвет, отличное состояние. Диван в идеальном состоянии, без повреждений. Продаю из-за переезда. В комплекте: диван, подушки.",
    condition: "excellent",
    views: 234,
    favorites: 45,
    date: "2024-01-03"
  },
  {
    id: 25,
    title: "Стол обеденный",
    price: 200,
    city: "Земун",
    sellerName: "Анна Морозова",
    photo: "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=400&h=300&fit=crop",
    photos: [
      "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=400&h=300&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=400&h=300&fit=crop&crop=entropy",
      "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=400&h=300&fit=crop&crop=center"
    ],
    category: "furniture",
    description: "Деревянный обеденный стол, 6 мест, натуральное дерево. Стол в хорошем состоянии, без повреждений. Продаю из-за покупки нового. В комплекте: стол, стулья.",
    condition: "good",
    views: 156,
    favorites: 23,
    date: "2024-01-02"
  },
  {
    id: 26,
    title: "Шкаф-купе",
    price: 350,
    city: "Нови Сад",
    sellerName: "Михаил Соколов",
    photo: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
    photos: [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop&crop=entropy",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop&crop=center"
    ],
    category: "furniture",
    description: "Вместительный шкаф-купе, белый цвет, зеркальные двери. Шкаф в отличном состоянии, без повреждений. Продаю из-за переезда. В комплекте: шкаф, полки, вешалки.",
    condition: "excellent",
    views: 189,
    favorites: 34,
    date: "2024-01-01"
  },

  // Детские товары
  {
    id: 27,
    title: "Коляска детская",
    price: 120,
    city: "Белград",
    sellerName: "Елена Петрова",
    photo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop",
    photos: [
      "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop&crop=entropy",
      "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop&crop=center"
    ],
    category: "kids",
    description: "Коляска-трость, легкая и компактная, синий цвет. Коляска в отличном состоянии, без повреждений. Продаю из-за того, что ребенок вырос. В комплекте: коляска, чехол, дождевик.",
    condition: "excellent",
    views: 167,
    favorites: 29,
    date: "2023-12-31"
  },
  {
    id: 28,
    title: "Игрушки конструктор",
    price: 35,
    city: "Нови Сад",
    sellerName: "Александр Козлов",
    photo: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&h=300&fit=crop",
    photos: [
      "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&h=300&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&h=300&fit=crop&crop=entropy",
      "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&h=300&fit=crop&crop=center"
    ],
    category: "kids",
    description: "Большой набор конструктора, 500 деталей, для детей 6+. Конструктор в хорошем состоянии, все детали на месте. Продаю из-за того, что ребенок вырос. В комплекте: конструктор, инструкция, коробка.",
    condition: "good",
    views: 89,
    favorites: 12,
    date: "2023-12-30"
  },
  {
    id: 29,
    title: "Велосипед детский",
    price: 85,
    city: "Белград",
    sellerName: "Мария Сидорова",
    photo: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=300&fit=crop",
    photos: [
      "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=300&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=300&fit=crop&crop=entropy",
      "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=300&fit=crop&crop=center"
    ],
    category: "kids",
    description: "Детский велосипед, 16 дюймов, красный цвет, с защитой. Велосипед в отличном состоянии, без повреждений. Продаю из-за того, что ребенок вырос. В комплекте: велосипед, насос, замок.",
    condition: "excellent",
    views: 134,
    favorites: 18,
    date: "2023-12-29"
  },

  // Товары для дома
  {
    id: 30,
    title: "Кофемашина DeLonghi",
    price: 280,
    city: "Белград",
    sellerName: "Дмитрий Волков",
    photo: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop",
    photos: [
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop&crop=entropy",
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop&crop=center"
    ],
    category: "goods",
    description: "Автоматическая кофемашина, капучино, эспрессо, отличное состояние. Кофемашина в идеальном состоянии, без повреждений. Продаю из-за покупки новой. В комплекте: кофемашина, инструкция, фильтры.",
    condition: "excellent",
    views: 245,
    favorites: 38,
    date: "2023-12-28"
  },
  {
    id: 31,
    title: "Пылесос Dyson",
    price: 180,
    city: "Нови Сад",
    sellerName: "Ольга Медведева",
    photo: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop",
    photos: [
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop&crop=entropy",
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop&crop=center"
    ],
    category: "goods",
    description: "Беспроводной пылесос, мощный, легкий, удобный в использовании. Пылесос в хорошем состоянии, без повреждений. Продаю из-за покупки нового. В комплекте: пылесос, зарядное устройство, насадки.",
    condition: "good",
    views: 178,
    favorites: 25,
    date: "2023-12-27"
  },
  {
    id: 32,
    title: "Микроволновка Samsung",
    price: 95,
    city: "Белград",
    sellerName: "Андрей Петров",
    photo: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&h=300&fit=crop",
    photos: [
      "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&h=300&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&h=300&fit=crop&crop=entropy",
      "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&h=300&fit=crop&crop=center"
    ],
    category: "goods",
    description: "Микроволновая печь, 800Вт, гриль, 25л, белый цвет. Микроволновка в отличном состоянии, без повреждений. Продаю из-за покупки новой. В комплекте: микроволновка, инструкция, подставка.",
    condition: "excellent",
    views: 123,
    favorites: 16,
    date: "2023-12-26"
  }
];

// Функция для загрузки товаров из localStorage
export const loadProductsFromStorage = () => {
  try {
    const savedProducts = localStorage.getItem('userProducts');
    if (savedProducts) {
      const parsedProducts = JSON.parse(savedProducts);
      // Добавляем загруженные товары в основной массив
      productsData.unshift(...parsedProducts);
    }
  } catch (error) {
    console.error('Ошибка загрузки товаров из localStorage:', error);
  }
};

// Функция для сохранения товаров в localStorage
const saveProductsToStorage = (products) => {
  try {
    localStorage.setItem('userProducts', JSON.stringify(products));
  } catch (error) {
    console.error('Ошибка сохранения товаров в localStorage:', error);
  }
};

// Функция для добавления нового товара/услуги
export const addNewProduct = (productData, images, currentUser = null) => {
  // Генерируем новый ID (максимальный ID + 1)
  const maxId = Math.max(...productsData.map(product => product.id));
  const newId = maxId + 1;
  
  // Получаем текущую дату
  const currentDate = new Date().toISOString().split('T')[0];
  
  // Определяем имя продавца
  const sellerName = currentUser?.name || currentUser?.username || "Текущий пользователь";
  
  // Обрабатываем изображения - используем сохраненные URL из tempimage
  const processedImages = images.length > 0 
    ? images.map(img => {
        // Если изображение было сохранено в tempimage, используем его URL
        if (img.savedId) {
          return img.preview; // Это URL из tempimage
        }
        // Иначе используем обычный preview или URL
        return img.preview || img.url || img;
      })
    : ["https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop"];
  
  // Создаем новый товар
  const newProduct = {
    id: newId,
    title: productData.title,
    price: parseFloat(productData.price),
    city: productData.city,
    street: productData.street,
    houseNumber: productData.houseNumber,
    sellerName: sellerName,
    photo: processedImages[0],
    photos: processedImages,
    category: productData.category,
    description: productData.description,
    condition: productData.condition,
    originalPrice: productData.originalPrice ? parseFloat(productData.originalPrice) : null,
    views: 0,
    favorites: 0,
    date: currentDate,
    sold: false, // Новые товары не проданные
    soldDate: null, // Дата продажи пока не установлена
    isService: productData.category === 'services' || productData.condition === 'service',
    // Добавляем информацию о сохраненных изображениях
    savedImages: images.filter(img => img.savedId).map(img => ({
      id: img.savedId,
      originalName: img.originalName,
      size: img.size
    }))
  };
  
  // Добавляем новый товар в начало массива (чтобы он был первым)
  productsData.unshift(newProduct);
  
  // Сохраняем в localStorage
  const userProducts = productsData.filter(product => 
    product.sellerName === sellerName
  );
  saveProductsToStorage(userProducts);
  
  console.log('Новый товар добавлен:', newProduct);
  console.log('Сохраненные изображения:', newProduct.savedImages);
  
  return newProduct;
};

// Функция для обновления товара (продажа, удаление)
export const updateProduct = (productId, updates) => {
  const productIndex = productsData.findIndex(p => p.id === productId);
  if (productIndex !== -1) {
    productsData[productIndex] = { ...productsData[productIndex], ...updates };
    
    // Сохраняем обновленные товары пользователя
    const sellerName = productsData[productIndex].sellerName;
    const userProducts = productsData.filter(product => 
      product.sellerName === sellerName
    );
    saveProductsToStorage(userProducts);
    
    console.log('Товар обновлен:', productsData[productIndex]);
  }
};

// Функция для удаления товара
export const deleteProduct = (productId) => {
  const productIndex = productsData.findIndex(p => p.id === productId);
  if (productIndex !== -1) {
    const sellerName = productsData[productIndex].sellerName;
    productsData.splice(productIndex, 1);
    
    // Сохраняем обновленные товары пользователя
    const userProducts = productsData.filter(product => 
      product.sellerName === sellerName
    );
    saveProductsToStorage(userProducts);
    
    console.log('Товар удален:', productId);
  }
};

// Функция для получения случайных товаров
export const getRandomProducts = (count = 6) => {
  const shuffled = [...productsData].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Функция для получения только товаров (не услуг)
export const getRandomProductsOnly = (count = 6) => {
  const productsOnly = productsData.filter(product => !product.isService);
  const shuffled = [...productsOnly].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Функция для получения случайных услуг
export const getRandomServices = (count = 6) => {
  const services = productsData.filter(product => product.isService);
  const shuffled = [...services].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Функция для получения товаров по категории
export const getProductsByCategory = (category) => {
  console.log('Поиск товаров для категории:', category);
  console.log('Все доступные товары:', productsData);
  
  const filteredProducts = productsData.filter(product => {
    console.log(`Проверяем товар ${product.id}: category=${product.category}, isService=${product.isService}`);
    return product.category === category;
  });
  
  console.log('Найденные товары для категории', category, ':', filteredProducts);
  return filteredProducts;
};

// Функция для получения услуг
export const getServices = () => {
  return productsData.filter(product => product.isService);
};

// Функция для получения товара по ID
export const getProductById = (id) => {
  return productsData.find(product => product.id === parseInt(id));
};

// Функция для поиска товаров
export const searchProducts = (query) => {
  if (!query || query.trim() === '') {
    return [];
  }
  
  const searchTerm = query.toLowerCase().trim();
  
  return productsData.filter(product => 
    product.title.toLowerCase().includes(searchTerm) ||
    product.description.toLowerCase().includes(searchTerm) ||
    product.city.toLowerCase().includes(searchTerm) ||
    product.sellerName.toLowerCase().includes(searchTerm)
  );
};

// Функция для получения статистики по категориям
export const getCategoryStats = () => {
  const stats = {};
  
  productsData.forEach(product => {
    const category = product.category;
    if (!stats[category]) {
      stats[category] = 0;
    }
    stats[category]++;
  });
  
  console.log('Статистика по категориям:', stats);
  return stats;
};

// Функция для получения категорий с количеством товаров
export const getCategoriesWithCount = () => {
  const stats = getCategoryStats();
  return Object.entries(stats).map(([category, count]) => ({ category, count }));
};

// Функция для отладки категории
export const debugCategory = (category) => {
  const products = getProductsByCategory(category);
  console.log(`Товары в категории ${category}:`, products);
  return products;
};

// Функция для отладки всех категорий
export const debugAllCategories = () => {
  const categories = [...new Set(productsData.map(product => product.category))];
  console.log('Все категории:', categories);
  return categories;
};

// Функция для получения всех продуктов
export const getAllProducts = () => {
  return productsData;
};

// Загружаем товары при инициализации (после всех определений)
loadProductsFromStorage(); 