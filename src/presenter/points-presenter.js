import {render, RenderPosition} from '../framework/render.js';

import SortView from '../view/sort-view.js';
import PointsListView from '../view/points-list-view.js';
import PointAddView from '../view/point-add-view.js';
import NoPointView from '../view/no-point-view.js';

import PointPresenter from './point-presenter.js';

import { sortData } from '../utils/sort.js';
import {updateItem} from '../utils/common.js';

export default class PointsPresenter {
  #pointsComponent = new PointsListView();
  #sortComponent = null;
  #noPointsComponent = new NoPointView();
  #sort = sortData;

  #pointsModel = null;

  #pointsContainer = null;
  #pointsList = [];
  #sourcedPointsList = [];
  #allDestinationsList = [];
  #allOffersByTypeList = [];

  #pointPresenter = new Map();


  constructor({ pointsContainer, pointsModel }) {
    this.#pointsContainer = pointsContainer;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#pointsList = [...this.#pointsModel.points];
    this.#sourcedPointsList = [...this.#pointsModel.points];
    this.#allDestinationsList = [...this.#pointsModel.allDestinations];
    this.#allOffersByTypeList = [...this.#pointsModel.allOffersByType];

    this.#renderBoard();
  }

  #handleModeChange = () => {
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };


  #handleTaskChange = (updatedPoint) => {
    this.#pointsList = updateItem(this.#pointsList, updatedPoint);
    this.#pointPresenter.get(updatedPoint.id).init(updatedPoint);
  };

  #sortPoints(sortType) {
    switch(sortType) {
      case SORT_TYPE.PRICE:
        this.#pointsList.sort(sortPrice);
        break;
      case SORT_TYPE.TIME:
        this.#pointsList.sort(sortTime);
        break;
      default:
        this.#pointsList = [...this.#sourcedPointsList];
    }
    this._currentSortType = sortType;
  }

  #handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._sortPoints(sortType);
  }

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

  #renderBoard() {
    render(this.#pointsComponent, this.#pointsContainer);

    if (this.#pointsList.length === 0) {
      this.#renderNoPoints();
      return;
    }

    this.#renderSort();
    this.#renderPointsList();
  }
}
