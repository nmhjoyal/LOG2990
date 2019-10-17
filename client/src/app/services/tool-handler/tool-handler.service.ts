import { Injectable } from '@angular/core';
import { ITools } from 'src/app/drawing-view/components/tools/assets/interfaces/itools';
import { AppConstants } from 'src/AppConstants';

@Injectable({
  providedIn: 'root',
})
export class ToolHandlerService {

// Shape Handling attributes
noneSelected: boolean;
rectangleSelected: boolean;
colourApplicatorSelected: boolean;
crayonSelected: boolean;
paintbrushSelected: boolean;
​
// Color service simulating attributes
primaryColor: string;
secondaryColor: string;
​
// drawings Storage
drawings: ITools[] = []; // change type to parent of IDrawingTool

constructor() {
    this.noneSelected = true;
    this.rectangleSelected = false;
    this.colourApplicatorSelected = false;
    this.crayonSelected = false;
    this.paintbrushSelected = false;
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
    this.paintbrushSelected = false;
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
choosePaintbrush(): void {
    this.resetSelection();
    this.paintbrushSelected = true;
    this.noneSelected = false;
}
​
chooseOther(): void {// Place holder for unimplemented tools
    this.resetSelection();
}
​
}
