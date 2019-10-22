import { Injectable } from '@angular/core';
import { IDrawingTool } from 'src/app/drawing-view/components/tools/assets/interfaces/drawing-tool-interface';
import { ToolConstants } from 'src/app/drawing-view/components/tools/assets/tool-constants';
import { Strings } from 'src/AppConstants/Strings';

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
pipetteSelected: boolean;
​
// Color service simulating attributes
primaryColor: string;
secondaryColor: string;
​
// drawings Storage
drawings: IDrawingTool[] = []; // change type to parent of IDrawingTool

// Attributes Storage
crayonStrokeWidth: number;
paintbrushStrokeWidth: number;
paintbrushFilter: string;

constructor() {
    this.noneSelected = true;
    this.rectangleSelected = false;
    this.colourApplicatorSelected = false;
    this.crayonSelected = false;
    this.paintbrushSelected = false;
    this.pipetteSelected = false;
    this.primaryColor = Strings.BLACK_HEX;
    this.secondaryColor = Strings.WHITE_HEX;
    this.crayonStrokeWidth = ToolConstants.DEFAULT_STROKE_WIDTH;
    this.paintbrushStrokeWidth = ToolConstants.DEFAULT_STROKE_WIDTH;
    this.paintbrushFilter = ToolConstants.NONE;
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
    this.pipetteSelected = false;
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

chooseEyedropper(): void {
  this.resetSelection();
  this.pipetteSelected = true;
  this.noneSelected = false;
}
​
chooseOther(): void {// Place holder for unimplemented tools
    this.resetSelection();
}
​
}
