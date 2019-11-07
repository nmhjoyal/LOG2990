import { Injectable } from '@angular/core';
import { Id, ToolConstants } from 'src/app/drawing-view/components/tools/assets/constants/tool-constants';
import { ITools } from 'src/app/drawing-view/components/tools/assets/interfaces/itools';
import { IShape } from '../../drawing-view/components/tools/assets/interfaces/shape-interface';
import { ColorService } from '../color_service/color.service';
import { DrawingStorageService } from '../drawing-storage/drawing-storage.service'

@Injectable({
  providedIn: 'root',
})
export class ToolHandlerService {

  // Shape Handling attributes
 tools = Id;
 selectedTool: String;
​
  // Color service simulating attributes
  primaryColorSelected: boolean;
  secondaryColorSelected: boolean;
  primaryColor: string;
  secondaryColor: string;

  constructor(public colorService: ColorService, public drawingStorage: DrawingStorageService) {
    this.selectedTool = this.tools.NONE;
    this.primaryColorSelected = false;
    this.secondaryColorSelected = false;
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
    this.selectedTool = this.tools.NONE;
    this.primaryColorSelected = false;
    this.secondaryColorSelected = false;
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

  seeSelection(): IShape {
    return this.drawingStorage.seeSelection();
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
      this.selectedTool = this.tools.RECTANGLE;
  }

  choosePolygon(): void {
    this.resetSelection();
    this.selectedTool = this.tools.POLYGON;
}
​
  chooseColourApplicator(primaryColor: string, secondaryColor: string): void {
    this.resetSelection();
    this.primaryColor = primaryColor;
    this.secondaryColor = secondaryColor;
    this.selectedTool = this.tools.COLOUR_APPLICATOR;
  }

  chooseLine(): void {
    this.resetSelection();
    this.selectedTool = this.tools.LINE;
  }

  chooseEyedropper(): void {
    this.resetSelection();
    this.selectedTool = this.tools.PIPETTE;
  }
​
  chooseCrayon(): void {
    this.resetSelection();
    this.selectedTool = this.tools.CRAYON;
  }
​
  choosePaintbrush(): void {
      this.resetSelection();
      this.selectedTool = this.tools.PAINTBRUSH;
  }

  chooseSelector(): void {
    this.resetSelection();
    this.selectedTool = this.tools.SELECTOR;
  }
​
  choosePrimaryColor(): void {
    this.resetSelection();
    this.primaryColorSelected = true;
    this.colorService.chooseColor(false);
  }  ​

  chooseSecondaryColor(): void {
    this.resetSelection();
    this.secondaryColorSelected = true;
    this.colorService.chooseColor(true);
  }  ​

  chooseEllipse(): void {
    this.resetSelection();
    this.selectedTool = this.tools.ELLIPSE;
  }

  chooseStamp(): void {
    this.resetSelection();
    this.selectedTool = this.tools.STAMP;
  }

  chooseText(): void {
    this.resetSelection();
    this.selectedTool = this.tools.TEXT;
  }

  chooseOther(): void {// Place holder for unimplemented tools
      this.resetSelection();
  }
}
