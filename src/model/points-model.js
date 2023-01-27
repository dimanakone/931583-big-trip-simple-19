import Observable from '../framework/observable.js';

import {
  generatePoint,
  getDestinationsData,
  getOffersByTypeData
} from '../mocks/data.js';

const TASK_COUNT = 8;

const offersByType = getOffersByTypeData();
const destinations = getDestinationsData();
const getPoint = () => generatePoint(offersByType,destinations);

export default class PointsModel extends Observable {
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

  updatePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === point.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      update,
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  addPoint(updateType, update) {
    this.#points = [
      update,
      ...this.#points,
    ];

    this._notify(updateType, update);
  }

  deletePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType);
  }
}

