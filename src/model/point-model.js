import {
  generatePoint,
  getDestinationsData,
  getOffersByTypeData
} from '../mocks/data.js';

const TASK_COUNT = 8;

const offersByType = getOffersByTypeData();
const destinations = getDestinationsData();
const getPoint = () => generatePoint(offersByType,destinations);

export default class PointsModel {
  #offersByType = offersByType;
  #destinations = destinations;
  #points = Array.from({length: TASK_COUNT}, getPoint);

  get points() {
    return this.#points;
  }

  get allDestinations() {
    return this.#destinations;
  }

  get allOffersByType() {
    return this.#offersByType;
  }
}

