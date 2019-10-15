import { Injectable } from '@angular/core';
import { IDrawingTool } from '../../drawing-view/components/tools/assets/interfaces/shape-interface';

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
  drawings: IDrawingTool[]; // USING TYPEOF INSTEAD OF STRING MIGHT BE LIGHTER?

  constructor() {
    this.drawings = [];
    this.noneSelected = true;
    this.rectangleSelected = false;
    this.colourApplicatorSelected = false;
    this.crayonSelected = false;
    this.pinceauSelected = false;
    this.primaryColor = "green"; // empty string and subscribe to color in colorservice?
    this.secondaryColor = "blue";
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
  chooseColourApplicator(): void {
      this.resetSelection();
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
