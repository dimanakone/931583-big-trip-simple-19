import AbstractView from '../framework/view/abstract-view.js';

function createFilterItemTemplate(filterItem) {
  const {title, value} = filterItem;

  return (
    `<div class="trip-filters__filter">
      <input id="filter-${value}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${value}">
      <label class="trip-filters__filter-label" for="filter-${value}">${title}</label>
    </div>`
  );
}

function createFilterTemplate(filterItems = []) {
  const filterItemsTemplate = filterItems
    .map((filter) => createFilterItemTemplate(filter))
    .join('');

  return (
    `<form class="trip-filters" action="#" method="get">
    ${filterItemsTemplate}
    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`
  );
}

export default class FilterView extends AbstractView {
  #filters = null;

  constructor(filters) {
    super();
    this.#filters = filters;
  }

  get template() {
    return createFilterTemplate(this.#filters);
  }
}
