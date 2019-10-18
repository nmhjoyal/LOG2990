import { Injectable } from '@angular/core';
import { ToolConstants } from '../tool-constants';
import { IDrawingToolOptions } from '../interfaces/drawing-tool-interface';
import { IShapeOptions } from '../interfaces/shape-interface';

@Injectable({
  providedIn: 'root',
})
export class AttributesService {

  crayonAttributes: IDrawingToolOptions;
  paintbrushAttributes: IDrawingToolOptions;
  rectangleAttributes: IShapeOptions;

  resetCrayonAttributes(): void {
    this.crayonAttributes = {
      id: ToolConstants.TOOL_ID.CRAYON,
      wasSaved: false,
      savedStrokeWidth: ToolConstants.DEFAULT_STROKE_WIDTH,
      savedFilter: ToolConstants.NONE,
    };
  }
  resetPaintbrushAttributes(): void {
    this.paintbrushAttributes = {
      id: ToolConstants.TOOL_ID.PAINTBRUSH,
      wasSaved: false,
      savedStrokeWidth: ToolConstants.DEFAULT_STROKE_WIDTH,
      savedFilter: ToolConstants.NONE,
    };
  }
  resetRectangleAttributes(): void {
    this.rectangleAttributes = {
      id: ToolConstants.TOOL_ID.RECTANGLE,
      wasSaved: false,
      savedStrokeWidth: ToolConstants.NULL,
      savedTraceMode: ToolConstants.NULL,
    };
  }
  resetSavedAttributes(): void {
    if (this.crayonAttributes.wasSaved) {
      this.resetCrayonAttributes();
    }
    if(this.paintbrushAttributes.wasSaved){
      this.resetPaintbrushAttributes();
    }
    if (this.rectangleAttributes.wasSaved) {
      this.resetRectangleAttributes();
    }
  }
  
  constructor() {
    this.resetSavedAttributes();
    }

}
