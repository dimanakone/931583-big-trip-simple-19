import {
  getRandomInt,
  getRandomElementArray,
  getRandomDate,
  increaseRandomDate,
} from '../utils/common.js';

const TRIP_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];
const DESCRIPTIONS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat.',
  'Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.',
];
const CITIES = ['Geneva', 'Amsterdam', 'Paris', 'London', 'Moscow', 'Helsinki', 'Oslo','Berlin', 'Rome', 'Budapest', 'Oslo'];
const OFFER_TITLES = ['Order Uber', 'Rent a car', 'Add luggage', 'Switch to comfort', 'Add meal', 'Add breakfast', 'Book tickets'];
const OFFER_PRICES = [20, 50, 100, 200, 350];

// Генерирует оффер
const generateOffer = (title) => ({
  title,
  price: OFFER_PRICES[getRandomInt(0, OFFER_PRICES.length - 1)],
  isChecked: Boolean(Math.round(Math.random())),
});

// Получает массив из всех офферов на основе заголовков офферов
const getOffersData = () => {
  const offers = [];
  OFFER_TITLES.forEach((element, index) => {
    const offer = generateOffer(element);
    offer.id = index + 1;
    offers.push(offer);
  });
  return offers;
};

// Получает случаный массив офферов для типа поездки
const getRandomOffersData = () => {
  const randomOffers = [];
  const offersData = getOffersData();
  for (let i = 0; i < getRandomInt(3, 5); i++) {
    const randomOffer = getRandomElementArray(offersData);
    if (!randomOffers.includes(randomOffer)) {
      randomOffers.push(randomOffer);
    }
  }
  return randomOffers;
};

// Генерирует оффер по типу поездки
const generateOffersByType = (type) => ({
  type,
  offers: getRandomOffersData(),
});

// Получает массив из рандомных офферов по типу поездки
const getOffersByTypeData = () => {
  const offersByType = [];
  TRIP_TYPES.forEach((element) => {
    offersByType.push(generateOffersByType(element));
  });
  return offersByType;
};

// Генерирует объект картинки
const generatePicture = () => ({
  src: `https://loremflickr.com/248/152?random=${getRandomInt(1, 100)}`,
  description: 'Text for picture',
});

// Получает массив из рандомных картинок
const getPicturesData = () => {
  const pictures = [...new Array(getRandomInt(1, 5))];
  return pictures.map(() => generatePicture());
};

// Получает описание точки маршрута из рандомных предложений
const getDescriptionDestination = () => {
  const descriptionDestination = [...new Array(getRandomInt(1, 5))];
  return descriptionDestination.map(() => getRandomElementArray(DESCRIPTIONS)).join(' ');
};

// Генерирует объект пункта назначения
const generateDestination = (name) => ({
  name,
  description: getDescriptionDestination(),
  pictures: getPicturesData(),
});

// Получает массив из пунктов назначения
const getDestinationsData = () => {
  const destinations = [];
  CITIES.forEach((element, index) => {
    const city = generateDestination(element);
    city.id = index + 1;
    destinations.push(city);
  });
  return destinations;
};

// Генерирует точку маршрута
const generatePoint = (offers, destinations) => {
  const date = getRandomDate();
  const type = TRIP_TYPES[getRandomInt(0, TRIP_TYPES.length - 1)];
  const typeOffers = offers.find((el) => el.type === type ).offers;

  return {
    price: getRandomInt(50, 1000),
    dateFrom: date,
    dateTo: increaseRandomDate(date),
    destination: getRandomElementArray(destinations).id,
    offers: typeOffers,
    type: type,
  };
};

export {
  generatePoint,
  getDestinationsData,
  getOffersByTypeData,
};
