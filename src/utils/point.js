import dayjs from 'dayjs';

const getDateFormat = ((date) => dayjs(date).format('YY/MM/DD HH:mm'));
const getDateISO = ((date) => dayjs(date).format('YYYY-MM-DDTHH:mm'));
const getDateHoursMinutes = ((date) => dayjs(date).format('HH:mm'));
const getDateMonthDay = ((date) => dayjs(date).format('MMM DD'));

const isDatesEqual = (dateA, dateB) =>
  (dateA === null && dateB === null) ? true : dayjs(dateA).isSame(dateB, 'D');

const DEFAULT_POINT = {
  type: 'taxi',
  dateFrom: new Date(),
  dateTo: new Date(),
  price: 150,
  destination: 1,
  offers: []
};

export {
  getDateFormat,
  getDateISO,
  getDateHoursMinutes,
  getDateMonthDay,
  isDatesEqual,
  DEFAULT_POINT
};
