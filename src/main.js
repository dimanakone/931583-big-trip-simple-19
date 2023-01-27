import {render} from './framework/render.js';

import FilterPresenter from './presenter/filter-presenter.js';
import TripRoutePresenter from './presenter/trip-route-presenter.js';

import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';

import NewPointButtonView from './view/new-point-button-view.js';

const siteHeaderElement = document.querySelector('.page-header');
const siteMainElement = document.querySelector('.page-main');
const siteFilterElement = siteHeaderElement.querySelector('.trip-controls__filters');
const siteButtonElement = siteHeaderElement.querySelector('.trip-main');
const siteTripRouteElement = siteMainElement.querySelector('.trip-events');

const pointsModel = new PointsModel();
const filterModel = new FilterModel();

const tripRoutePresenter = new TripRoutePresenter({
  tripRouteContainer: siteTripRouteElement,
  pointsModel,
  filterModel,
  onNewPointDestroy: handleNewPointFormClose
});

const filterPresenter = new FilterPresenter({
  filterContainer: siteFilterElement,
  pointsModel,
  filterModel
});

const newPointButtonComponent = new NewPointButtonView({
  onClick: handleNewPointButtonClick
});

function handleNewPointFormClose() {
  newPointButtonComponent.element.disabled = false;
}

function handleNewPointButtonClick() {
  tripRoutePresenter.createPoint();
  newPointButtonComponent.element.disabled = true;
}

render(newPointButtonComponent, siteButtonElement);

filterPresenter.init();
tripRoutePresenter.init();

