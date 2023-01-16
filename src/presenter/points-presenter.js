import {render, RenderPosition} from '../framework/render.js';

import SortView from '../view/sort-view.js';
import PointsListView from '../view/points-list-view.js';
import PointAddView from '../view/point-add-view.js';
import NoPointView from '../view/no-point-view.js';

import PointPresenter from './point-presenter.js';

import { sortData, sortCallbackMap, sortStartDateUp } from '../utils/sort.js';
import {updateItem} from '../utils/common.js';
import {SortType} from '../utils/const.js';

export default class PointsPresenter {
  #pointsComponent = new PointsListView();
  #sortComponent = null;
  #noPointsComponent = new NoPointView();
  #sort = sortData;

  #pointsModel = null;

  #pointsContainer = null;
  #pointsList = [];
  #allDestinationsList = [];
  #allOffersByTypeList = [];
  #pointPresenter = new Map();
  #sourcedPointsList = [];
  #currentSortType = SortType.DAY;

  constructor({ pointsContainer, pointsModel }) {
    this.#pointsContainer = pointsContainer;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#pointsList = [...this.#pointsModel.points].sort(sortStartDateUp);
    this.#sourcedPointsList = [...this.#pointsModel.points];
    this.#allDestinationsList = [...this.#pointsModel.allDestinations];
    this.#allOffersByTypeList = [...this.#pointsModel.allOffersByType];

    this.#renderTripPoints();
  }

  #handleModeChange = () => {
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };


  #handlePointChange = (updatedPoint) => {
    this.#pointsList = updateItem(this.#pointsList, updatedPoint);
    this.#sourcedPointsList = updateItem(this.#sourcedPointsList, updatedPoint);
    this.#pointPresenter.get(updatedPoint.id).init(updatedPoint);
  };

  #sortPoints(sortType) {
    switch(sortType) {
      case SortType.DAY:
        this.#pointsList.sort(sortCallbackMap[SortType.DAY]);
        break;
      case SortType.PRICE:
        this.#pointsList.sort(sortCallbackMap[SortType.PRICE]);
        break;
      default:
        this.#pointsList = [...this.#sourcedPointsList];
    }
    this.#currentSortType = sortType;
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortPoints(sortType);
    this.#clearPointsList();
    this.#renderPointsList();
  };

  #renderSort() {
    this.#sortComponent = new SortView({
      sort: this.#sort ,
      onSortTypeChange: this.#handleSortTypeChange,
    });
    render(this.#sortComponent, this.#pointsContainer, RenderPosition.AFTERBEGIN);
  }

  #renderPoint(point, destinations, offerTypes) {
    const pointPresenter = new PointPresenter({
      pointsContainer: this.#pointsComponent.element,
      onModeChange: this.#handleModeChange
    });

    pointPresenter.init(point, destinations, offerTypes);
    this.#pointPresenter.set(point.id, pointPresenter);
  }

  #renderPointsList() {
    this.#pointsList
      .forEach((task) => this.#renderPoint(task, this.#allDestinationsList, this.#allOffersByTypeList));
  }

  #clearPointsList() {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
  }

  #renderNoPoints() {
    render(this.#noPointsComponent, this.#pointsContainer, RenderPosition.AFTERBEGIN);
  }

  #renderTripPoints() {
    render(this.#pointsComponent, this.#pointsContainer);

    if (this.#pointsList.length === 0) {
      this.#renderNoPoints();
      return;
    }

    this.#renderSort();
    this.#renderPointsList();
  }
}
