import { Injectable } from '@angular/core';
import { Id } from 'src/app/drawing-view/components/tools/assets/constants/tool-constants';
import { IShape } from '../../drawing-view/components/tools/assets/interfaces/shape-interface';
import { ColourService } from '../colour_service/colour.service';

@Injectable({
  providedIn: 'root',
})
export class ToolHandlerService {

  tools = Id;
  selectedTool: string;
  protected lastCalled: string;
  protected selection: IShape;
  protected primaryColourSelected: boolean;
  protected secondaryColourSelected: boolean;
  primaryColour: string;
  secondaryColour: string;

  constructor(public colourService: ColourService) {
    this.selection = {
      x: 0, y: 0, width: 0, height: 0, primaryColour: 'black', secondaryColour: 'black',
      fillOpacity: 0, strokeOpacity: 1, strokeWidth: 1, id: Id.SELECTOR,
    };
    this.selectedTool = this.tools.NONE;
    this.lastCalled = this.tools.NONE;
    this.primaryColourSelected = false;
    this.secondaryColourSelected = false;
    this.primaryColour = this.colourService.PrimaryColour;
    this.secondaryColour = this.colourService.SecondaryColour;
  }

  resetToolSelection(): void {
    this.selectedTool = this.tools.NONE;
    this.resetSelectorBox();
    this.primaryColourSelected = false;
    this.secondaryColourSelected = false;
  }

  isUsingText(): boolean {
    return this.selectedTool === this.tools.TEXT;
  }

  isUsingPen(): boolean {
    return this.selectedTool === this.tools.PEN;
  }

  // Selector Tool Methods

  resetSelectorBox(): void {
    this.selection = {
      x: 0, y: 0, width: 0, height: 0, primaryColour: 'black', secondaryColour: 'black',
      fillOpacity: 0, strokeOpacity: 1, strokeWidth: 1, id: Id.SELECTOR,
    };
  }

  saveSelectorBox(shape: IShape): void {
    this.selection = {
      x: shape.x, y: shape.y, width: shape.width, height: shape.height, primaryColour: 'black', secondaryColour: 'black',
      fillOpacity: 0, strokeOpacity: 1, strokeWidth: 1, id: Id.SELECTOR,
    };
  }

  selectorBoxExists(): boolean {
    return (this.selection.width > 0 && this.selection.height > 0);
  }

  chooseRectangle(): void {
    this.resetToolSelection();
    this.selectedTool = this.tools.RECTANGLE;
  }

  choosePolygon(): void {
    this.resetToolSelection();
    this.selectedTool = this.tools.POLYGON;
  }

  chooseColourApplicator(): void {
    this.resetToolSelection();
    this.selectedTool = this.tools.COLOUR_APPLICATOR;
  }

  chooseLine(): void {
    this.resetToolSelection();
    this.selectedTool = this.tools.LINE;
  }

  chooseEyedropper(): void {
    this.resetToolSelection();
    this.selectedTool = this.tools.PIPETTE;
  }

  chooseCrayon(): void {
    this.resetToolSelection();
    this.selectedTool = this.tools.CRAYON;
  }

  choosePaintbrush(): void {
    this.resetToolSelection();
    this.selectedTool = this.tools.PAINTBRUSH;
  }

  choosePen(): void {
    this.resetToolSelection();
    this.selectedTool = this.tools.PEN;
  }

  chooseSelector(): void {
    this.resetToolSelection();
    this.selectedTool = this.tools.SELECTOR;
  }

  chooseGrid(): void {
    this.resetToolSelection();
    this.selectedTool = this.tools.GRID;
  }
​
  choosePrimaryColour(): void {
    this.lastCalled = this.selectedTool;
    this.primaryColourSelected = true;
    // this.callLastFunction();
  }

  chooseSecondaryColour(): void {
    this.lastCalled = this.selectedTool;
    this.secondaryColourSelected = true;
    // this.callLastFunction();
  }

  chooseEllipse(): void {
    this.resetToolSelection();
    this.selectedTool = this.tools.ELLIPSE;
  }

  chooseStamp(): void {
    this.resetToolSelection();
    this.selectedTool = this.tools.STAMP;
  }

  chooseEraser(): void {
    this.resetToolSelection();
    this.selectedTool = this.tools.ERASER;
  }

  chooseText(): void {
    this.resetToolSelection();
    this.selectedTool = this.tools.TEXT;
  }

  chooseOther(): void {// Place holder for unimplemented tools
    this.resetToolSelection();
  }
/*
  callLastFunction(): void {
    if (this.lastCalled === this.tools.PEN) {
      this.choosePen();
    }
    if (this.lastCalled === this.tools.CRAYON) {
      this.chooseCrayon();
    }
    if (this.lastCalled === this.tools.PAINTBRUSH) {
      this.choosePaintbrush();
    }
    if (this.lastCalled === this.tools.POLYGON) {
      this.choosePolygon();
    }
    if (this.lastCalled === this.tools.ELLIPSE) {
      this.chooseEllipse();
    }
    if (this.lastCalled === this.tools.RECTANGLE) {
      this.chooseRectangle();
    }

  }*/
}
