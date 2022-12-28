import {render} from './framework/render.js';

import FilterView from './view/filter-view.js';
import PointsPresenter from './presenter/points-presenter.js';
import PointsModel from './model/point-model.js';

import { filters } from './utils/filter.js';

const siteHeaderElement = document.querySelector('.page-header');
const siteMainElement = document.querySelector('.page-main');
const siteFilterElement = siteHeaderElement.querySelector('.trip-controls__filters');
const sitePointsElement = siteMainElement.querySelector('.trip-events');

const pointsModel = new PointsModel();

const pointsPresenter = new PointsPresenter({
  pointsContainer: sitePointsElement,
  pointsModel
});

render(new FilterView(filters), siteFilterElement);

pointsPresenter.init();

