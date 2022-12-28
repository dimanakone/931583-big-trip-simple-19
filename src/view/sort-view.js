import AbstractView from '../framework/view/abstract-view.js';

function createSortItemTemplate(sortItem) {
  const {title, value, disabled} = sortItem;

  return (
    `<div class="trip-sort__item  trip-sort__item--${value}">
      <input id="sort-${value}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${value}" ${disabled ? 'disabled' : ''}>
      <label class="trip-sort__btn" for="sort-${value}">${title}</label>
    </div>`
  );
}

function createSortTemplate(sortItems = []) {
  const sortItemsTemplate = sortItems
    .map((item) => createSortItemTemplate(item))
    .join('');

  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    ${sortItemsTemplate}
    </form>`
  );
}

export default class SortView extends AbstractView {
  #sort = null;

  constructor(sort) {
    super();

    this.#sort = sort;
  }

  get template() {
    return createSortTemplate(this.#sort);
  }
}
