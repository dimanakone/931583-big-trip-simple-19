import SortView from '../view/sort-view.js';
import PointsListView from '../view/points-list-view.js';
import PointView from '../view/point-view.js';
import PointEditView from '../view/point-edit-view.js';
import PointAddView from '../view/point-add-view.js';
import NoPointView from '../view/no-point-view.js';

import { render } from '../render.js';

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
    const pointComponent = new PointView({point, destinations});
    const pointEditComponent = new PointEditView({point, destinations, offerTypes});

    const replaceCardToForm = () => {
      this.#pointsComponent.element.replaceChild(pointEditComponent.element, pointComponent.element);
    };
    const replaceFormToCard = () => {
      this.#pointsComponent.element.replaceChild(pointComponent.element, pointEditComponent.element);
    };
    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replaceFormToCard();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    pointComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      replaceCardToForm();
      document.addEventListener('keydown', escKeyDownHandler);
    });

    pointEditComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      replaceFormToCard();
      document.removeEventListener('keydown', escKeyDownHandler);
    });

    pointEditComponent.element.querySelector('form').addEventListener('submit', (evt) => {
      evt.preventDefault();
      replaceFormToCard();
      document.removeEventListener('keydown', escKeyDownHandler);
    });

    render(pointComponent, this.#pointsComponent.element);
  }

  #renderBoard() {
    if (this.#pointsList.length === 0) {
      render(new NoPointView(), this.#pointsContainer);
    } else {
      render(new SortView(), this.#pointsContainer);
      render(this.#pointsComponent, this.#pointsContainer);
      for (let i = 0; i < this.#pointsList.length; i++) {
        this.#renderPoint(this.#pointsList[i], this.#allDestinationsList, this.#allOffersByTypeList);
      }
    }
  }
}
