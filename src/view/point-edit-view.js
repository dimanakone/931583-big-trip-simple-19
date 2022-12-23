import AbstractView from '../framework/view/abstract-view.js';
import { getDateFormat } from '../utils/point.js';

function createPointEditTemplate(point, destinations, offerTypes) {

  const { dateFrom, dateTo, type, destination, price, offers } = point;

  const createTypeListMarkup = () => {
    const typeList = offerTypes.map((el) => el.type);
    return typeList
      .map((item) => `<div class="event__type-item">
        <input id="event-type-${item}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${item}">
        <label class="event__type-label  event__type-label--${item}" for="event-type-${item}-1">${item}</label>
        </div>`)
      .join(' ');
  };

  const createOfferMarkup = (offer) => {
    const checkboxState = offer.isChecked
      ? 'checked'
      : '';
    return `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="${offer.title}" type="checkbox" name="event-offer-${offer.title}"} ${checkboxState}>
      <label class="event__offer-label" for="${offer.title}">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="even__offer-price">${offer.price}</span>
      </label>
    </div>`;
  };

  const typeListMarkup = createTypeListMarkup();
  const destinationsListMarkup = destinations.map((city) => `<option value="${city.name}"></option>`).join(' ');
  const offersMarkup = offers.map((el) => createOfferMarkup(el)).join(' ');
  const destinationMarkup = destinations.find((el) => el.id === destination).name;
  const descriptionMarkup = destinations.find((el) => el.id === destination).description;

  return (
    `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">

        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
              ${typeListMarkup}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${type}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destinationMarkup}" list="destination-list-1">
          <datalist id="destination-list-1">
            ${destinationsListMarkup}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${getDateFormat(dateFrom)}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${getDateFormat(dateTo)}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      <section class="event__details">
        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>

          <div class="event__available-offers">
            ${offersMarkup}
          </div>
        </section>

        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${descriptionMarkup}</p>
        </section>
      </section>
    </form>
  </li>`
  );
}

export default class PointEditView extends AbstractView {
  #point = null;
  #destinations = null;
  #offerTypes = null;

  #handleFormSubmit = null;
  #handleEditClick = null;

  constructor({ point, destinations, offerTypes, onFormSubmit, onEditClick }) {
    super();

    this.#point = point;
    this.#destinations = destinations;
    this.#offerTypes = offerTypes;

    this.#handleFormSubmit = onFormSubmit;
    this.element.querySelector('form')
      .addEventListener('submit', this.#formSubmitHandler);

    this.#handleEditClick = onEditClick;
    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#editClickHandler);
  }

  get template() {
    return createPointEditTemplate(this.#point, this.#destinations, this.#offerTypes);
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit();
  };

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditClick();
  };
}
