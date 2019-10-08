import { Injectable } from '@angular/core';
import { AppConstants } from 'src/AppConstants';
import { IShape } from '../../drawing-view/components/tools/shapes/assets/interfaces/shape-interface';

@Injectable({
  providedIn: 'root',
})
export class ToolHandlerService {

  // Shape Handling attributes
  noneSelected: boolean;
  rectangleSelected: boolean;
  colourApplicatorSelected: boolean;
  crayonSelected: boolean;
  pinceauSelected: boolean;
​
  // Color service simulating attributes
  primaryColor: string;
  secondaryColor: string;
​
  // Shape Storage
  drawings: IShape[] = []; // change type to parent of IShape

  constructor() {
    this.noneSelected = true;
    this.rectangleSelected = false;
    this.colourApplicatorSelected = false;
    this.crayonSelected = false;
    this.pinceauSelected = false;
    this.primaryColor = AppConstants.DEFAULT_PRIMARY_COLOUR;
    this.secondaryColor = AppConstants.DEFAULT_SECONDARY_COLOUR;
  }
​
  // Tool Handling methods
  clearPage(): void {
      this.resetSelection();
      this.drawings.length = 0;
  }
​
  resetSelection(): void {
    this.noneSelected = true;
    this.rectangleSelected = false;
    this.colourApplicatorSelected = false;
    this.crayonSelected = false;
    this.pinceauSelected = false;
  }
​
  chooseRectangle(): void {
      this.resetSelection();
      this.rectangleSelected = true;
      this.noneSelected = false;
  }
​
  chooseColourApplicator(primaryColor: string, secondaryColor: string): void {
      this.resetSelection();
      this.primaryColor = primaryColor;
      this.secondaryColor = secondaryColor;
      this.colourApplicatorSelected = true;
      this.noneSelected = false;
  }
​
  chooseCrayon(): void {
      this.resetSelection();
      this.crayonSelected = true;
      this.noneSelected = false;
  }
​
  choosePinceau(): void {
      this.resetSelection();
      this.pinceauSelected = true;
      this.noneSelected = false;
  }
​
  chooseOther(): void {// Place holder for unimplemented tools
      this.resetSelection();
  }
​
}
