import { Injectable } from '@angular/core';
import { AppConstants } from 'src/AppConstants';
import { IShape } from '../drawing-view/components/tools/shapes/interfaces/shape-interface';

@Injectable({
  providedIn: 'root'
})
export class ToolHandlerService {

  // Shape Handling attributes
  protected rectangleSelected: boolean;
  protected colourApplicatorSelected: boolean;
  protected crayonSelected: boolean;
  protected pinceauSelected: boolean;
​
  // Color service simulating attributes
  primaryColor: string;
  secondaryColor: string;
​
  // Shape Storage
  public drawings:IShape[]; // change type to parent of IShape


  constructor() {
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
      this.rectangleSelected = false;
      this.colourApplicatorSelected = false;
      this.crayonSelected = false;
      this.pinceauSelected = false;
  }
​
  chooseRectangle(): void {
      this.resetSelection();
      this.rectangleSelected = true;
  }
​
  chooseColourApplicator(primaryColor: string, secondaryColor: string): void {
      this.resetSelection();
      this.primaryColor = primaryColor;
      this.secondaryColor = secondaryColor;
      this.colourApplicatorSelected = true;
  }
​
  chooseCrayon(): void {
      this.resetSelection();
      this.crayonSelected = true;
  }
​
  choosePinceau(): void {
      this.resetSelection();
      this.pinceauSelected = true;
  }
​
  chooseOther(): void {// Place holder for unimplemented tools
      this.resetSelection();
  }
​
}
