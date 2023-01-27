import { SortType } from '../utils/const.js';

const sort = {
  [SortType.DAY]: (point, nextPoint) => point.dateFrom - nextPoint.dateFrom,
  [SortType.EVENT]: () => 0,
  [SortType.TIME]: () => 0,
  [SortType.PRICE]: (point, nextPoint) => nextPoint.price - point.price,
  [SortType.OFFERS]: () => 0
};

const sortStartDateUp = (point, nextPoint) => point.dateFrom - nextPoint.dateFrom;

export { sort, sortStartDateUp};
