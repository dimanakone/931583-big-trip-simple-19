import AbstractView from '../framework/view/abstract-view.js';

function createTripRouteTemplate() {
  return '<ul class="trip-events__list"></ul>';
}

export default class TripRouteView extends AbstractView {
  get template() {
    return createTripRouteTemplate();
  }
}
