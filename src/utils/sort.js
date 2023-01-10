import { SortType } from '../utils/const.js';

const sortTitleMap = {
  [SortType.DAY]: 'Day',
  [SortType.EVENT]: 'Event',
  [SortType.TIME]: 'Time',
  [SortType.PRICE]: 'Price',
  [SortType.OFFERS]: 'Offers'
};

const sortDisabilityMap = {
  [SortType.DAY]: false,
  [SortType.EVENT]: true,
  [SortType.TIME]: true,
  [SortType.PRICE]: false,
  [SortType.OFFERS]: true
};

const sortData = Object.entries(sortTitleMap)
  .map(([value, title]) => {
    const disabled = sortDisabilityMap[value];
    return {
      title,
      value,
      disabled
    };
  });

const sortCallbackMap = {
  [SortType.DAY]: (point, nextPoint) => point.dateFrom - nextPoint.dateFrom,
  [SortType.EVENT]: () => 0,
  [SortType.TIME]: () => 0,
  [SortType.PRICE]: (point, nextPoint) => nextPoint.price - point.price,
  [SortType.OFFERS]: () => 0
};

const sortStartDateUp = (point, nextPoint) => point.dateFrom - nextPoint.dateFrom;

export { sortData, sortCallbackMap, sortStartDateUp };
