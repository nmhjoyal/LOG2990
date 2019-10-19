import { Injectable } from '@angular/core';
import { ILineOptions } from '../interfaces/shape-interface';
import { ToolConstants } from '../tool-constants';

@Injectable({
  providedIn: 'root',
})
export class AttributesService {

  attributes: ILineOptions;

  constructor() {
    this.attributes = {
      id: ToolConstants.TOOL_ID.LINE,
      wasSaved: false,
      savedStrokeWidth: ToolConstants.NULL,
      savedPointMode: ToolConstants.NULL,
      savedPointWidth: ToolConstants.NULL,
    };
  }

  resetSavedAttributes() {
    if (this.attributes.wasSaved) {
      this.attributes = {
        id: ToolConstants.TOOL_ID.LINE,
        wasSaved: false,
        savedStrokeWidth: ToolConstants.NULL,
        savedPointMode: ToolConstants.NULL,
        savedPointWidth: ToolConstants.NULL,
      };
    }
  }

}
