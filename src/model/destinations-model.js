import Observable from '../framework/observable.js';
import { UpdateType } from '../utils/const.js';

export default class DestinationsModel extends Observable {
  #destinations = [];

  #api = null;

  constructor({ api }) {
    super();
    this.#api = api;
  }

  get destinations() {
    return this.#destinations;
  }

  async init() {
    try {
      this.#destinations = await this.#api.destinations;
    } catch(err) {
      this.#destinations = [];
    }

    this._notify(UpdateType.INIT);
  }
}
