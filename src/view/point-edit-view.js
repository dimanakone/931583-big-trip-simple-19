import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { getDateFormat } from '../utils/point.js';
import flatpickr from 'flatpickr';

import 'flatpickr/dist/flatpickr.min.css';

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

  const createPictureMarkup = (picture) => `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`;

  const associatedDestination = destinations.find((el) => el.id === destination);

  const typeListMarkup = createTypeListMarkup();
  const destinationsListMarkup = destinations.map((city) => `<option value="${city.name}" id=""></option>`).join(' ');
  const offersMarkup = offers.map((el) => createOfferMarkup(el)).join(' ');
  const destinationMarkup = associatedDestination.name;
  const descriptionMarkup = associatedDestination.description;
  const picturesMarkup = associatedDestination.pictures.map((picture) => createPictureMarkup(picture)).join(' ');

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
          <input class="event__input  event__input--price" id="event-price-1" type="number" min="1" name="event-price" value="${price}">
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
          <div class="event__photos-container">
          <div class="event__photos-tape">
            ${picturesMarkup}
          </div>
        </div>
        </section>
      </section>
    </form>
  </li>`
  );
}

export default class PointEditView extends AbstractStatefulView {
  #destinations = null;
  #offerTypes = null;

  #datepickerStart = null;
  #datepickerFinish = null;

  #handleFormSubmit = null;
  #handleEditClick = null;

  constructor({ point, destinations, offerTypes, onFormSubmit, onEditClick }) {
    super();

    this._setState(PointEditView.parsePointToState(point));
    this.#destinations = destinations;
    this.#offerTypes = offerTypes;

    this.#handleFormSubmit = onFormSubmit;
    this.#handleEditClick = onEditClick;

    this._restoreHandlers();
    this.#setDatePicker();
  }

  get template() {
    return createPointEditTemplate(this._state, this.#destinations, this.#offerTypes);
  }

  removeElement() {
    super.removeElement();

    if (this.#datepickerStart) {
      this.#datepickerStart.destroy();
      this.#datepickerStart = null;
    }

    if (this.#datepickerFinish) {
      this.#datepickerFinish.destroy();
      this.#datepickerFinish = null;
    }
  }

  reset(point) {
    this.updateElement(
      PointEditView.parsePointToState(point)
    );
  }

  #setDatePicker() {
    if (this.#datepickerStart) {
      this.#datepickerStart.destroy();
      this.#datepickerStart = null;
    }
    if (this.#datepickerFinish) {
      this.#datepickerFinish.destroy();
      this.#datepickerFinish = null;
    }

    this.#datepickerStart = flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        dateFormat: 'd/m/y H:i',
        enableTime: true,
        defaultDate: this._state.dateFrom,
        onChange: this.#startDateChangeHandler
      }
    );

    this.#datepickerFinish = flatpickr(
      this.element.querySelector('#event-end-time-1'),
      {
        minDate: this._state.dateFrom,
        dateFormat: 'd/m/y H:i',
        enableTime: true,
        defaultDate: this._state.dateTo,
        onChange: this.#endDateChangeHandler
      }
    );
  }

  _restoreHandlers() {
    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#editClickHandler);

    this.element.querySelector('.event__type-group').addEventListener('change', this.#typeChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationChangeHandler);
    this.element.querySelector('.event__input--price').addEventListener('input', this.#priceInputHandler);

    this.#setDatePicker();
  }

  #startDateChangeHandler = ([userDate]) => {
    if (userDate < this._state.dateTo) {
      this.updateElement({
        dateFrom: userDate,
        dateTo: this._state.dateTo
      });
    } else {
      this.updateElement({
        dateFrom: userDate,
        dateTo: userDate
      });
    }

    this.#datepickerFinish.set('minDate', userDate);
  };

  #endDateChangeHandler = ([userDate]) => {
    this.updateElement({
      dateFrom: this._state.dateFrom,
      dateTo: userDate
    });
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit();
  };

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditClick();
  };

  #typeChangeHandler = (evt) => {
    evt.preventDefault();

    this.updateElement({
      type: evt.target.value,
      offers: this.#offerTypes.find((el) => el.type === evt.target.value).offers
    });
  };

  #destinationChangeHandler = (evt) => {
    evt.preventDefault();

    const destination = this.#destinations.find((item) => item.name === evt.target.value);

    this.updateElement({
      destination: destination.id
    });
  };

  #priceInputHandler = (evt) => {
    evt.preventDefault();

    this._setState({
      price: evt.target.value,
    });
  };

  static parsePointToState(point) {
    return {...point};
  }

  static parseStateToPoint(state) {
    return {...state};
  }
}
