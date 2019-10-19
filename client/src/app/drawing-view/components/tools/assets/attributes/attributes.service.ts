import { Injectable } from '@angular/core';
import { IShapeOptions } from '../interfaces/shape-interface';
import { ToolConstants } from '../tool-constants';

@Injectable({
  providedIn: 'root',
})
export class AttributesService {

  attributes: IShapeOptions;

  constructor() {
    this.attributes = {
      id: ToolConstants.TOOL_ID.LINE,
      wasSaved: false,
      savedStrokeWidth: ToolConstants.NULL,
      savedTraceMode: ToolConstants.NULL,
    };
  }

  resetSavedAttributes() {
    if (this.attributes.wasSaved) {
      this.attributes = {
        id: ToolConstants.TOOL_ID.LINE,
        wasSaved: false,
        savedStrokeWidth: ToolConstants.NULL,
        savedTraceMode: ToolConstants.NULL,
      };
    }
  }

}
