import SortView from '../view/sort-view.js';
import PointsListView from '../view/points-list-view.js';
import PointTripView from '../view/point-trip-view.js';
import PointTripEditView from '../view/point-trip-edit-view.js';
import PointTripAddView from '../view/point-trip-add-view.js';

import { render } from '../render.js';

export default class PointsTripPresenter {
  pointsComponent = new PointsListView();

  constructor({ pointsContainer, pointsModel }) {
    this.pointsContainer = pointsContainer;
    this.pointsModel = pointsModel;
  }

  init() {
    this.pointsList = [...this.pointsModel.getPoints()];
    render(new SortView(), this.pointsContainer);
    render(this.pointsComponent, this.pointsContainer);
    render(new PointTripEditView({point: this.pointsList[0]}),this.pointsComponent.getElement());
    for (let i = 1; i < this.pointsList.length; i++) {
      render(new PointTripView({point: this.pointsList[i]}), this.pointsComponent.getElement());
    }
    render(new PointTripAddView(),this.pointsComponent.getElement());
  }
}
