import {createElement} from '../render.js';
import {getDateISO, getDateHoursMinutes, getDateMonthDay} from '../util.js';

function createPointTemplate(points, destinations) {

  const {dateFrom, dateTo, type, destination, price, offers} = points;

  console.log(offers);

  const createOfferElementMarkup = (offer) =>
    `<li class="event__offer">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </li>`;

  const offersListMarkup = offers.filter((item) => item.isChecked === true).map((item) => createOfferElementMarkup(item)).join(' ');
  const destinationMarkup = destinations.find((el) => el.id === destination).name;


  return (
    `<li class="trip-events__item">
    <div class="event">
      <time class="event__date" datetime="${getDateISO(dateFrom)}">${getDateMonthDay(dateFrom)}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${type} ${destinationMarkup}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${getDateISO(dateFrom)}">${getDateHoursMinutes(dateFrom)}</time>
          &mdash;
          <time class="event__end-time" datetime="${getDateISO(dateTo)}">${getDateHoursMinutes(dateTo)}</time>
        </p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${price}</span>
      </p>
      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
        ${offersListMarkup}
      </ul>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>`
  );
}

export default class PointView {
  #point = null;
  #destinations = null;
  #element = null;

  constructor({point, destinations}) {
    this.#point = point;
    this.#destinations = destinations;
  }

  get template() {
    return createPointTemplate(this.#point, this.#destinations);
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
