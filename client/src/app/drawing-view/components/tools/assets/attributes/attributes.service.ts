import { Injectable } from '@angular/core';
import { IShapeOptions } from '../interfaces/shape-interface';
import { ToolConstants } from '../tool-constants';

@Injectable({
  providedIn: 'root'
})
export class AttributesService {

  rectangleAttributes: IShapeOptions;

  constructor() { 
    this.rectangleAttributes = {
      id: ToolConstants.TOOL_ID.RECTANGLE,
      wasSaved: false, 
      savedStrokeWidth: ToolConstants.NULL,
      savedTraceMode: ToolConstants.NULL, 
    };
  }

  resetSavedAttributes(){
    if (this.rectangleAttributes.wasSaved){
      this.rectangleAttributes = {
        id: ToolConstants.TOOL_ID.RECTANGLE,
        wasSaved: false, 
        savedStrokeWidth: ToolConstants.NULL,
        savedTraceMode: ToolConstants.NULL, 
      };
    }
  }

}
