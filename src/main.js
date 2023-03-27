import {render} from './framework/render.js';

import FilterPresenter from './presenter/filter-presenter.js';
import TripRoutePresenter from './presenter/trip-route-presenter.js';

import PointsModel from './model/points-model.js';
import OffersModel from './model/offers-model.js';
import DestinationsModel from './model/destinations-model.js';
import FilterModel from './model/filter-model.js';

import NewPointButtonView from './view/new-point-button-view.js';

import Api from './api.js';

const AUTHORIZATION = 'Basic dimon4ik666';
const END_POINT = 'https://19.ecmascript.pages.academy/big-trip-simple';

const siteHeaderElement = document.querySelector('.page-header');
const siteMainElement = document.querySelector('.page-main');
const siteFilterElement = siteHeaderElement.querySelector('.trip-controls__filters');
const siteButtonElement = siteHeaderElement.querySelector('.trip-main');
const siteTripRouteElement = siteMainElement.querySelector('.trip-events');

const api = new Api(END_POINT, AUTHORIZATION);

const pointsModel = new PointsModel({
  api
});

const offersModel = new OffersModel({
  api
});

const destinationsModel = new DestinationsModel({
  api
});

const filterModel = new FilterModel();

const tripRoutePresenter = new TripRoutePresenter({
  tripRouteContainer: siteTripRouteElement,
  pointsModel,
  offersModel,
  destinationsModel,
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

filterPresenter.init();
tripRoutePresenter.init();

offersModel.init();
destinationsModel.init();
pointsModel.init()
  .finally(() => {
    render(newPointButtonComponent, siteButtonElement);
  });

