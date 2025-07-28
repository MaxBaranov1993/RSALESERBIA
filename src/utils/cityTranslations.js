// Функция для перевода названий городов
export const translateCity = (cityName, t) => {
  const cityMap = {
    'Белград': 'cities.belgrade',
    'Нови Сад': 'cities.noviSad',
    'Земун': 'cities.zemun',
    'Belgrade': 'cities.belgrade',
    'Novi Sad': 'cities.noviSad',
    'Zemun': 'cities.zemun',
    'Београд': 'cities.belgrade',
    'Нови Сад': 'cities.noviSad',
    'Земун': 'cities.zemun'
  };

  const translationKey = cityMap[cityName];
  return translationKey ? t(translationKey) : cityName;
}; 