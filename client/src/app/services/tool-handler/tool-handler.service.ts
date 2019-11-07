import { Injectable } from '@angular/core';
import { Id, ToolConstants } from 'src/app/drawing-view/components/tools/assets/constants/tool-constants';
import { IShape } from '../../drawing-view/components/tools/assets/interfaces/shape-interface';
import { ColorService } from '../color_service/color.service';
import { DrawingStorageService } from '../drawing-storage/drawing-storage.service'

@Injectable({
  providedIn: 'root',
})
export class ToolHandlerService {

  // Drawings Handling attributes
 tools = Id;
 selectedTool: String;
 selection: IShape;
​
  // Color service related attributes
  primaryColorSelected: boolean;
  secondaryColorSelected: boolean;
  primaryColor: string;
  secondaryColor: string;

  constructor(public colorService: ColorService, public drawingStorage: DrawingStorageService) {
    this.selection = { x: 0, y: 0, width: 0, height: 0, primaryColor: 'black', secondaryColor: 'black',
    fillOpacity: 0, strokeOpacity: 1, strokeWidth: 1, id: Id.SELECTOR };
    this.selectedTool = this.tools.NONE;
    this.primaryColorSelected = false;
    this.secondaryColorSelected = false;
    this.primaryColor = this.colorService.color[ToolConstants.PRIMARY_COLOUR_INDEX];
    this.secondaryColor = this.colorService.color[ToolConstants.SECONDARY_COLOUR_INDEX];
  }
​
  // Tool Logic methods
  ​
  resetToolSelection(): void {
    this.selectedTool = this.tools.NONE;
    this.primaryColorSelected = false;
    this.secondaryColorSelected = false;
    this.resetSelectorBox();
  }

  isUsingText() : boolean {
    return this.selectedTool === this.tools.TEXT;
  }
  
  // Selector Tool Methods

  resetSelectorBox(): void {
    this.selection = { x: 0, y: 0, width: 0, height: 0, primaryColor: 'black', secondaryColor: 'black',
    fillOpacity: 0, strokeOpacity: 1, strokeWidth: 1, id: Id.SELECTOR };
  }

  seeSelection(): IShape {
    return this.selection;
  }

  saveSelectorBox(shape: IShape): void {
    this.selection = { x: shape.x, y: shape.y, width: shape.width, height: shape.height, primaryColor: 'black', secondaryColor: 'black',
    fillOpacity: 0, strokeOpacity: 1, strokeWidth: 1, id: Id.SELECTOR };
  }

  selectorBoxExists(): boolean {
    return (this.selection.width > 0 && this.selection.height > 0);
  }

  // Tool selecting methods
​
  chooseRectangle(): void {
      this.resetToolSelection();
      this.selectedTool = this.tools.RECTANGLE;
  }

  choosePolygon(): void {
    this.resetToolSelection();
    this.selectedTool = this.tools.POLYGON;
}
​
  chooseColourApplicator(primaryColor: string, secondaryColor: string): void {
    this.resetToolSelection();
    this.primaryColor = primaryColor;
    this.secondaryColor = secondaryColor;
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
​
  chooseCrayon(): void {
    this.resetToolSelection();
    this.selectedTool = this.tools.CRAYON;
  }
​
  choosePaintbrush(): void {
      this.resetToolSelection();
      this.selectedTool = this.tools.PAINTBRUSH;
  }

  chooseSelector(): void {
    this.resetToolSelection();
    this.selectedTool = this.tools.SELECTOR;
  }
​
  choosePrimaryColor(): void {
    this.resetToolSelection();
    this.primaryColorSelected = true;
    this.colorService.chooseColor(false);
  }  ​

  chooseSecondaryColor(): void {
    this.resetToolSelection();
    this.secondaryColorSelected = true;
    this.colorService.chooseColor(true);
  }  ​

  chooseEllipse(): void {
    this.resetToolSelection();
    this.selectedTool = this.tools.ELLIPSE;
  }

  chooseStamp(): void {
    this.resetToolSelection();
    this.selectedTool = this.tools.STAMP;
  }

  chooseText(): void {
    this.resetToolSelection();
    this.selectedTool = this.tools.TEXT;
  }

  chooseOther(): void {// Place holder for unimplemented tools
      this.resetToolSelection();
  }
}
