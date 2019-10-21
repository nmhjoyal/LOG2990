import { Injectable } from '@angular/core';
import { IDrawingToolOptions } from '../interfaces/drawing-tool-interface';
import { ILineOptions, IShapeOptions } from '../interfaces/shape-interface';
import { ToolConstants } from '../tool-constants';

@Injectable({
  providedIn: 'root',
})
export class AttributesService {

  crayonAttributes: IDrawingToolOptions;
  paintbrushAttributes: IDrawingToolOptions;
  rectangleAttributes: IShapeOptions;
  lineAttributes: ILineOptions;

  constructor() {
    this.resetRectangleAttributes();
    this.resetCrayonAttributes();
    this.resetPaintbrushAttributes();
    this.resetLineAttributes();
    }

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

  resetLineAttributes(): void {
      this.lineAttributes = {
        id: ToolConstants.TOOL_ID.LINE,
        wasSaved: false,
        savedTraceMode: '',
        savedStrokeWidth: ToolConstants.NULL,
        savedJunctionMode: '',
        savedPointWidth: ToolConstants.NULL,
      };
  }

  resetSavedAttributes(): void {
    if (this.crayonAttributes.wasSaved) {
      this.resetCrayonAttributes();
    }
    if (this.paintbrushAttributes.wasSaved) {
      this.resetPaintbrushAttributes();
    }
    if (this.rectangleAttributes.wasSaved) {
      this.resetRectangleAttributes();
    }
    if (this.lineAttributes.wasSaved) {
      this.resetLineAttributes();
    }
  }
}
