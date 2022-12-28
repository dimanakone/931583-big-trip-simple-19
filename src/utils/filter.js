import { FilterType } from '../utils/const.js';

const filterTitleMap = {
  [FilterType.EVERYTHING]: 'Everything',
  [FilterType.FUTURE]: 'Future',
};

const filters = Object.entries(filterTitleMap).map(([value, title]) => ({title, value}));

const filterCallback = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => point.dateFrom > Date.now()),
};

export { filters, filterCallback };
