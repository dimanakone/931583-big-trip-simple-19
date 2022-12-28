import SortView from '../view/sort-view.js';
import PointsListView from '../view/points-list-view.js';
import PointView from '../view/point-view.js';
import PointEditView from '../view/point-edit-view.js';
import PointAddView from '../view/point-add-view.js';
import NoPointView from '../view/no-point-view.js';

import { sort } from '../utils/sort.js';

import {render, replace} from '../framework/render.js';

export default class PointsPresenter {
  #pointsComponent = new PointsListView();
  #pointsContainer = null;
  #pointsModel = null;
  #pointsList = [];
  #allDestinationsList = [];
  #allOffersByTypeList = [];

  constructor({ pointsContainer, pointsModel }) {
    this.#pointsContainer = pointsContainer;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#pointsList = [...this.#pointsModel.points];
    this.#allDestinationsList = [...this.#pointsModel.allDestinations];
    this.#allOffersByTypeList = [...this.#pointsModel.allOffersByType];

    this.#renderBoard();
  }

  #renderPoint(point, destinations, offerTypes) {
    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replaceFormToCard.call(this);
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    const pointComponent = new PointView({
      point,
      destinations,
      onEditClick: () => {
        replaceCardToForm.call(this);
        document.addEventListener('keydown', escKeyDownHandler);
      }
    });

    const pointEditComponent = new PointEditView({
      point,
      destinations,
      offerTypes,
      onFormSubmit: () => {
        replaceFormToCard.call(this);
        document.removeEventListener('keydown', escKeyDownHandler);
      },
      onEditClick: () => {
        replaceFormToCard.call(this);
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    });

    function replaceCardToForm() {
      replace(pointEditComponent, pointComponent);
    }
    function replaceFormToCard() {
      replace(pointComponent, pointEditComponent);
    }

    render(pointComponent, this.#pointsComponent.element);
  }

  #renderBoard() {
    if (this.#pointsList.length === 0) {
      render(new NoPointView(), this.#pointsContainer);
    } else {
      render(new SortView(sort), this.#pointsContainer);
      render(this.#pointsComponent, this.#pointsContainer);
      for (let i = 0; i < this.#pointsList.length; i++) {
        this.#renderPoint(this.#pointsList[i], this.#allDestinationsList, this.#allOffersByTypeList);
      }
    }
  }
}
