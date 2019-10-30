import { Injectable } from '@angular/core';
import { ToolConstants } from 'src/app/drawing-view/components/tools/assets/tool-constants';
import { IShape } from '../../drawing-view/components/tools/assets/interfaces/shape-interface';
import { ColorService } from '../color_service/color.service';
import { DrawingStorageService } from '../drawing-storage/drawing-storage.service'
import { ITools } from 'src/app/drawing-view/components/tools/assets/interfaces/itools';

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

  constructor(public colorService: ColorService, public drawingStorage: DrawingStorageService) {
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
​
  // Tool Handling methods
  clearPage(): void {
    this.resetSelection();
    this.emptyDrawings();
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

  // Interface to the drawing storage

  saveDrawing(drawing: ITools): void {
    this.drawingStorage.saveDrawing(drawing);
  }

  seeDrawings(): ITools[] {
    return this.drawingStorage.seeDrawings();
  }
  
  emptyDrawings(): void {
    this.drawingStorage.emptyDrawings();
  }

  resetSelectorBox(): void {
    this.drawingStorage.resetSelectorBox();
  }

  saveSelectorBox(shape: IShape): void {
    this.drawingStorage.saveSelectorBox(shape);
  }

  selectorBoxExists(): boolean {
    return this.drawingStorage.selectorBoxExists();
  }

  // Tool selecting methods
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
