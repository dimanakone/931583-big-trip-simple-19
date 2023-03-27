import Observable from '../framework/observable.js';

import {UpdateType} from '../utils/const.js';

export default class PointsModel extends Observable {
  #points = [];

  #api = null;

  constructor({ api }) {
    super();
    this.#api = api;
  }

  get points() {
    return this.#points;
  }

  async init() {
    try {
      const points = await this.#api.points;
      this.#points = points.map(this.#adaptToClient);
    } catch(err) {
      this.#points = [];
    }

    this._notify(UpdateType.INIT);
  }

  async updatePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === point.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    try {
      const response = await this.#api.updatePoint(update);
      const updatedPoint = this.#adaptToClient(response);
      this.#points = [
        ...this.#points.slice(0, index),
        updatedPoint,
        ...this.#points.slice(index + 1),
      ];
      this._notify(updateType, updatedPoint);
    } catch(err) {
      throw new Error('Can\'t update point');
    }
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

  #adaptToClient(points) {
    const adaptedPoint = {...points,
      dateFrom: points['date_from'] !== null ? new Date(points['date_from']) : points['date_from'],
      dateTo: points['date_to'] !== null ? new Date(points['date_to']) : points['date_to'],
      price: points['base_price'],
    };

    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];
    delete adaptedPoint['base_price'];

    return adaptedPoint;
  }
}

