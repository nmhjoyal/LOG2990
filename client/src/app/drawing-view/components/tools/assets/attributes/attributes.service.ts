import { Injectable } from '@angular/core';
import { Strings } from 'src/AppConstants/Strings';
import { FontFamilies } from '../constants/text-constants';
import { ToolConstants } from '../constants/tool-constants';
import { IBucketOptions } from '../interfaces/bucket-interfaces';
import { IDrawingToolOptions, ILineOptions } from '../interfaces/drawing-tool-interface';
import { IShapeOptions } from '../interfaces/shape-interface';
import { IStampOptions } from '../interfaces/stamp-interface';
import { ITextOptions } from '../interfaces/text-interface';

@Injectable({
  providedIn: 'root',
})
export class AttributesService {

  crayonAttributes: IDrawingToolOptions;
  paintbrushAttributes: IDrawingToolOptions;
  bucketAttributes: IBucketOptions;
  penAttributes: IDrawingToolOptions;
  rectangleAttributes: IShapeOptions;
  polygonAttributes: IShapeOptions;
  lineAttributes: ILineOptions;
  ellipseAttributes: IShapeOptions;
  stampAttributes: IStampOptions;
  textAttributes: ITextOptions;

  constructor() {
    this.resetRectangleAttributes();
    this.resetCrayonAttributes();
    this.resetPaintbrushAttributes();
    this.resetBucketAttributes();
    this.resetPolygonAttributes();
    this.resetLineAttributes();
    this.resetEllipseAttributes();
    this.resetStampAttributes();
    this.resetPenAttributes();
    this.resetTextAttributes();
  }

  resetPolygonAttributes(): void {
    this.polygonAttributes = {
      id: ToolConstants.TOOL_ID.POLYGON,
      wasSaved: false,
      savedVerticesNumber: 0,
      savedStrokeWidth: ToolConstants.NULL,
      savedTraceMode: ToolConstants.NULL,
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    };
  }

  resetCrayonAttributes(): void {
    this.crayonAttributes = {
      id: ToolConstants.TOOL_ID.CRAYON,
      wasSaved: false,
      savedStrokeWidth: ToolConstants.DEFAULT_STROKE_WIDTH,
      savedFilter: ToolConstants.NONE,
      savedMaxWidth: 0,
      savedMinWidth: 0,
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    };
  }

  resetPaintbrushAttributes(): void {
    this.paintbrushAttributes = {
      id: ToolConstants.TOOL_ID.PAINTBRUSH,
      wasSaved: false,
      savedStrokeWidth: ToolConstants.DEFAULT_STROKE_WIDTH,
      savedFilter: ToolConstants.NONE,
      savedMaxWidth: 0,
      savedMinWidth: 0,
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    };
  }

  resetBucketAttributes(): void {
    this.bucketAttributes = {
      id: ToolConstants.TOOL_ID.BUCKET,
      wasSaved: false,
      savedTraceMode: ToolConstants.TRACE_MODE.CONTOUR_FILL,
      savedStrokeWidth: ToolConstants.DEFAULT_STROKE_WIDTH,
      savedTolerance: ToolConstants.DEFAULT_TOLERANCE,
      savedMaxWidth: 0,
      savedMinWidth: 0,
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    };
  }

  resetPenAttributes(): void {
    this.penAttributes = {
      id: ToolConstants.TOOL_ID.PEN,
      wasSaved: false,
      savedStrokeWidth: ToolConstants.DEFAULT_STROKE_WIDTH,
      savedFilter: ToolConstants.NONE,
      savedMaxWidth: 0,
      savedMinWidth: 0,
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    };
  }
  resetRectangleAttributes(): void {
    this.rectangleAttributes = {
      id: ToolConstants.TOOL_ID.RECTANGLE,
      wasSaved: false,
      savedStrokeWidth: ToolConstants.NULL,
      savedTraceMode: ToolConstants.NULL,
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    };
  }
  resetEllipseAttributes(): void {
    this.ellipseAttributes = {
      id: ToolConstants.TOOL_ID.ELLIPSE,
      wasSaved: false,
      savedStrokeWidth: ToolConstants.NULL,
      savedTraceMode: ToolConstants.NULL,
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    };
  }
  resetStampAttributes(): void {
    this.stampAttributes = {
      id: ToolConstants.TOOL_ID.STAMP,
      wasSaved: false,
      savedAngle: ToolConstants.NULL,
      savedScaleFactor: ToolConstants.NULL,
      x: 0,
      y: 0,
      width: 0,
      height: 0,
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
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    };
  }
  resetTextAttributes(): void {
    this.textAttributes = {
      id: ToolConstants.TOOL_ID.TEXT,
      wasSaved: false,
      savedFontSize: 12,
      savedItalic: '',
      savedBold: '',
      savedFontFamily: FontFamilies.ARIAL,
      savedPrimaryColour: Strings.BLACK_HEX,
      x: 0,
      y: 0,
      width: 0,
      height: 0,
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
    if (this.polygonAttributes.wasSaved) {
      this.resetPolygonAttributes();
    }
    if (this.lineAttributes.wasSaved) {
      this.resetLineAttributes();
    }
    if (this.ellipseAttributes.wasSaved) {
      this.resetEllipseAttributes();
    }
    if (this.stampAttributes.wasSaved) {
      this.resetStampAttributes();
    }
    if (this.penAttributes.wasSaved) {
      this.resetPenAttributes();
    }
    if (this.textAttributes.wasSaved) {
      this.resetTextAttributes();
    }
  }
}
