import { Injectable } from '@angular/core';
import { ITools } from 'src/app/drawing-view/components/tools/assets/interfaces/itools';
import { Id, ToolConstants } from 'src/app/drawing-view/components/tools/assets/tool-constants';
import { IShape } from '../../drawing-view/components/tools/assets/interfaces/shape-interface';
import { ColorService } from '../color_service/color.service';

@Injectable({
  providedIn: 'root',
})
export class ToolHandlerService {

  // Shape Handling attributes
  noneSelected: boolean;
  rectangleSelected: boolean;
  polygonSelected: boolean;
  colourApplicatorSelected: boolean;
  pipetteSelected: boolean;
  crayonSelected: boolean;
  pinceauSelected: boolean;
  lineSelected: boolean;
  paintbrushSelected: boolean;
  selectorSelected: boolean;
  ellipseSelected: boolean;
  primaryColorSelected: boolean;
  secondaryColorSelected: boolean;
​
  // Color service simulating attributes
  primaryColor: string;
  secondaryColor: string;
  ​
  // Shape Storage
  drawings: ITools[];
  undoList: ITools[];
  accessingUndoList: boolean;
  selection: IShape;

  constructor(public colorService: ColorService) {
    this.drawings = [];
    this.undoList = [];
    this.accessingUndoList = false;
    this.selection = { x: 0, y: 0, width: 0, height: 0, primaryColor: 'black', secondaryColor: 'black',
    fillOpacity: 0, strokeOpacity: 1, strokeWidth: 1, id: Id.SELECTOR };
    this.noneSelected = true;
    this.rectangleSelected = false;
    this.colourApplicatorSelected = false;
    this.crayonSelected = false;
    this.pinceauSelected = false;
    this.lineSelected = false;
    this.paintbrushSelected = false;
    this.polygonSelected = false;
    this.selectorSelected = false;
    this.pipetteSelected = false;
    this.primaryColorSelected = false;
    this.secondaryColorSelected = false;
    this.ellipseSelected = false;
    this.primaryColor = this.colorService.color[ToolConstants.PRIMARY_COLOUR_INDEX];
    this.secondaryColor = this.colorService.color[ToolConstants.SECONDARY_COLOUR_INDEX];
  }

  // TODO: Test the undo and redo

  undo(): void {
    this.accessingUndoList = true;
    const poppedObject = this.drawings.pop();
    if ( poppedObject != undefined ){
      this.undoList.push(poppedObject);
    }
  }

  redo(): void {
    const poppedObject = this.undoList.pop();
    if ( poppedObject != undefined ){
      this.drawings.push(poppedObject);
    }
  }

  // TODO: test this method
  saveDrawing(drawingData: ITools): void {
    this.drawings.push(drawingData);
    if (this.accessingUndoList){
      this.undoList.length = 0;
      this.accessingUndoList = false;
    }
  }

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
    this.pipetteSelected = false;
    this.crayonSelected = false;
    this.pinceauSelected = false;
    this.lineSelected = false;
    this.paintbrushSelected = false;
    this.polygonSelected = false;
    this.selectorSelected = false;
    this.ellipseSelected = false;
    this.resetSelectorBox();
  }

  resetSelectorBox(): void {
    this.selection = { x: 0, y: 0, width: 0, height: 0, primaryColor: 'black', secondaryColor: 'black',
    fillOpacity: 0, strokeOpacity: 1, strokeWidth: 1, id: Id.SELECTOR };
  }

  saveSelectorBox(shape: IShape): void {
    this.selection = { x: shape.x, y: shape.y, width: shape.width, height: shape.height, primaryColor: 'black', secondaryColor: 'black',
    fillOpacity: 0, strokeOpacity: 1, strokeWidth: 1, id: Id.SELECTOR };
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

  choosePolygon(): void {
    this.resetSelection();
    this.polygonSelected = true;
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

  chooseLine(): void {
    this.resetSelection();
    this.lineSelected = true;
    this.noneSelected = false;
  }

  chooseEyedropper(): void {
    this.resetSelection();
    this.pipetteSelected = true;
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

  chooseEllipse(): void {
    this.resetSelection();
    this.ellipseSelected = true;
    this.noneSelected = false;
  }

  chooseOther(): void {// Place holder for unimplemented tools
      this.resetSelection();
  }
}
