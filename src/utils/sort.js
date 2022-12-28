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

const sort = Object.entries(sortTitleMap)
  .map(([value, title]) => {
    const disabled = sortDisabilityMap[value];
    return {
      title,
      value,
      disabled
    };
  });

const sortCallbackMap = {
  [SortType.DAY]: (point, nextPoint) => point.startDateAsNumber - nextPoint.startDateAsNumber,
  [SortType.EVENT]: () => 0,
  [SortType.TIME]: () => 0,
  [SortType.PRICE]: (point, nextPoint) => nextPoint.basePrice - point.basePrice,
  [SortType.OFFERS]: () => 0
};

export { sort, sortCallbackMap };
