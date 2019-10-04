import { Injectable } from '@angular/core';
import { AppConstants } from 'src/AppConstants';

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
  clear(): void {
      this.reset();
  }
​
  reset(): void {
      this.rectangleSelected = false;
      this.colourApplicatorSelected = false;
      this.crayonSelected = false;
      this.pinceauSelected = false;
  }
​
  chooseRectangle(): void {
      this.reset();
      this.rectangleSelected = true;
  }
​
  chooseColourApplicator(primaryColor: string, secondaryColor: string): void {
      this.reset();
      this.primaryColor = primaryColor;
      this.secondaryColor = secondaryColor;
      this.colourApplicatorSelected = true;
  }
​
  chooseCrayon(): void {
      this.reset();
      this.crayonSelected = true;
  }
​
  choosePinceau(): void {
      this.reset();
      this.pinceauSelected = true;
  }
​
  chooseOther(): void {// Place holder for unimplemented tools
      this.reset();
  }
​
}
