import { Injectable } from '@angular/core';
import { ToolConstants } from 'src/app/drawing-view/components/tools/assets/tool-constants';
import { IShape } from '../../drawing-view/components/tools/assets/interfaces/shape-interface';
import { ColorService } from '../color_service/color.service';

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
  selectorSelected: boolean;
  primaryColorSelected: boolean;
  secondaryColorSelected: boolean;
​
  // Color service simulating attributes
  primaryColor: string;
  secondaryColor: string;
  ​
  // Shape Storage
  drawings: IShape[]; // USING TYPEOF INSTEAD OF STRING MIGHT BE LIGHTER?
  selection: IShape;

  constructor(public colorService: ColorService) {
    this.drawings = [];
    this.selection = { x: 0, y: 0, width: 0, height: 0, primaryColor: 'none', secondaryColor: 'black',
                       fillOpacity: 0, strokeOpacity: 1, strokeWidth: 1 };
    this.noneSelected = true;
    this.rectangleSelected = false;
    this.colourApplicatorSelected = false;
    this.crayonSelected = false;
    this.paintbrushSelected = false;
    this.selectorSelected = false;
    this.primaryColorSelected = false;
    this.secondaryColorSelected = false;
    this.primaryColor = this.colorService.color[0];
    this.secondaryColor = this.colorService.color[1];
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
    this.selectorSelected = false;
    this.resetSelectorBox();
  }

  resetSelectorBox(): void {
    this.selection = { x: 0, y: 0, width: 0, height: 0, primaryColor: ToolConstants.NONE, secondaryColor: 'black',
      fillOpacity: 0, strokeOpacity: 1, strokeWidth: 1 };
  }

  saveSelectorBox(shape: IShape): void {
    this.selection = { x: shape.x, y: shape.y, width: shape.width, height: shape.height,
      primaryColor: 'black', secondaryColor: 'black', fillOpacity: 0,
      strokeOpacity: 1, strokeWidth: 1 };
  }

  selectorBoxExists(): boolean {
    return (this.selection.width > 0 && this.selection.height > 0);
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

  chooseSelector(): void {
    this.resetSelection();
    this.selectorSelected = true;
    this.noneSelected = false;
  }
​
  choosePrimaryColor(): void {
    this.resetSelection();
    this.primaryColorSelected = true;
    this.noneSelected = false;
    this.colorService.chooseColor(false);
  }  ​

  chooseSecondaryColor(): void {
    this.resetSelection();
    this.secondaryColorSelected = true;
    this.noneSelected = false;
    this.colorService.chooseColor(true);
  }  ​

  chooseOther(): void {// Place holder for unimplemented tools
      this.resetSelection();
  }
}
