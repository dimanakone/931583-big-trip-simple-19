import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';

import he from 'he';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import { getDateFormat, DEFAULT_POINT } from '../utils/point.js';

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

  const createOffersMarkup = (checkedOffers) => {
    const offersByType = offerTypes.find((offer) => offer.type === type).offers;

    return offersByType.map((offer) => {
      const isOfferChecked = checkedOffers.some((userOffer) => offer.id === userOffer);
      return `
    <div class="event__offer-selector">
        <input
          class="event__offer-checkbox visually-hidden"
          id="event-${offer.id}"
          type="checkbox"
          name="event-${offer.id}"
          ${isOfferChecked ? 'checked' : ''}
          data-title = "${offer.title}"
          data-price = "${offer.price}"
          data-id = "${offer.id}"
        >
        <label class="event__offer-label" for="event-${offer.id}">
          <span class="event__offer-title">${offer.title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${offer.price}</span>
        </label>
      </div>`;
    }).join('');
  };

  const createPictureMarkup = (picture) => `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`;

  const associatedDestination = destinations.find((el) => el.id === destination);
  const typeListMarkup = createTypeListMarkup();
  const destinationsListMarkup = destinations.map((city) => `<option value="${city.name}" id=""></option>`).join(' ');
  const offersMarkup = createOffersMarkup(offers);
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
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${he.encode(associatedDestination.name.toString())}" list="destination-list-1">
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
          <input class="event__input  event__input--price" id="event-price-1" min="0" type="number" name="event-price" value="${he.encode(price.toString())}">
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
          <p class="event__destination-description">${associatedDestination.description}</p>
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
  #handleCloseClick = null;
  #handleDeleteClick = null;

  constructor({ point = DEFAULT_POINT, destinations, offerTypes, onFormSubmit, onCloseClick, onDeleteClick }) {
    super();

    this._setState(PointEditView.parsePointToState(point));
    this.#destinations = destinations;
    this.#offerTypes = offerTypes;

    this.#handleCloseClick = onCloseClick;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleDeleteClick = onDeleteClick;

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
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#closeClickHandler);
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#formDeleteClickHandler);

    this.element.querySelector('.event__type-group').addEventListener('change', this.#typeChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationChangeHandler);
    this.element.querySelector('.event__input--price').addEventListener('input', this.#priceInputHandler);
    this.element.querySelector('.event__details').addEventListener('change', this.#offersSelectionHandler);

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

  #typeChangeHandler = (evt) => {
    evt.preventDefault();

    this.updateElement({
      type: evt.target.value,
      offers: [],
    });
  };

  #offersSelectionHandler = (evt) => {
    evt.preventDefault();

    const id = Number(evt.target.dataset.id);

    if (evt.target.checked) {
      this.updateElement({
        offers: [...this._state.offers, id]
      });
    } else {
      this.updateElement({
        offers: [...this._state.offers].filter((offer) => offer !== id)
      });
    }
  };

  #destinationChangeHandler = (evt) => {
    evt.preventDefault();

    document.querySelectorAll('#destination-list-1 option')
      .forEach((city) => {
        if (city.value !== evt.target.value) {
          evt.target.setCustomValidity('Select a destination from the list');
          evt.target.checkValidity();
        }
        else {
          const destination = this.#destinations.find((item) => item.name === evt.target.value);

          this.updateElement({
            destination: destination.id
          });
        }
      });
  };

  #priceInputHandler = (evt) => {
    evt.preventDefault();

    this._setState({
      price: Number(evt.target.value),
    });
  };

  #closeClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleCloseClick();
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(PointEditView.parseStateToPoint(this._state));
  };

  #formDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleDeleteClick(PointEditView.parseStateToPoint(this._state));
  };

  static parsePointToState(point) {
    return {...point};
  }

  static parseStateToPoint(state) {
    return {...state};
  }
}
