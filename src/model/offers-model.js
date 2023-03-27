import Observable from '../framework/observable.js';
import { UpdateType } from '../utils/const.js';

export default class OffersModel extends Observable {
  #offers = [];

  #api = null;

  constructor({ api }) {
    super();
    this.#api = api;
  }

  get offers() {
    return this.#offers;
  }

  async init() {
    try {
      this.#offers = await this.#api.offers;
    } catch(err) {
      this.#offers = [];
    }

    this._notify(UpdateType.INIT);
  }
}
