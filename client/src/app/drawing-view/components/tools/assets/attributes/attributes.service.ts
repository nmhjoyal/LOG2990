import { Injectable } from '@angular/core';
import { ToolConstants } from '../tool-constants';
import { IDrawingToolOptions } from '../interfaces/drawing-tool-interface';

@Injectable({
  providedIn: 'root',
})
export class AttributesService {

  crayonAttributes: IDrawingToolOptions;
  paintbrushAttributes: IDrawingToolOptions;

  constructor() {
    this.crayonAttributes = {
      id: ToolConstants.TOOL_ID.CRAYON,
      wasSaved: false,
      savedStrokeWidth: ToolConstants.DEFAULT_STROKE_WIDTH,
      savedFilter: ToolConstants.NONE,
    };
    this.paintbrushAttributes = {
      id:ToolConstants.TOOL_ID.PAINTBRUSH,
      wasSaved: false,
      savedStrokeWidth: ToolConstants.DEFAULT_STROKE_WIDTH,
      savedFilter: ToolConstants.NONE,
    };
  }

  resetSavedAttributes() {
    if (this.crayonAttributes.wasSaved) {
      this.crayonAttributes = {
        id: ToolConstants.TOOL_ID.CRAYON,
        wasSaved: false,
        savedStrokeWidth: ToolConstants.DEFAULT_STROKE_WIDTH,
        savedFilter: ToolConstants.NONE,
      };
    }
    if(this.paintbrushAttributes.wasSaved){
      this.paintbrushAttributes = {
        id:ToolConstants.TOOL_ID.PAINTBRUSH,
        wasSaved: false,
        savedStrokeWidth: ToolConstants.DEFAULT_STROKE_WIDTH,
        savedFilter: ToolConstants.NONE,
      };
    }
  }

}
