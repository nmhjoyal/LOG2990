import { Injectable } from '@angular/core';
import { IShapeOptions } from '../interfaces/shape-interface';
import { ToolConstants } from '../tool-constants';

@Injectable({
  providedIn: 'root',
})
export class AttributesService {

  lineAttributes: IShapeOptions;

  constructor() {
    this.lineAttributes = {
      id: ToolConstants.TOOL_ID.LINE,
      wasSaved: false,
      savedStrokeWidth: ToolConstants.NULL,
      savedTraceMode: ToolConstants.NULL,
    };
  }

  resetSavedAttributes() {
    if (this.lineAttributes.wasSaved) {
      this.lineAttributes = {
        id: ToolConstants.TOOL_ID.LINE,
        wasSaved: false,
        savedStrokeWidth: ToolConstants.NULL,
        savedTraceMode: ToolConstants.NULL,
      };
    }
  }

}
