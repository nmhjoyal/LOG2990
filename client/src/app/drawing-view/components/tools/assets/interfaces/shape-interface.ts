import { IDrawingTool } from './drawing-tool-interface';
import { ITools } from './itools';
import { IStamp } from './stamp-interface';

export interface IPreviewBox {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface IPolygon {
    vertices?: string;
}

export interface IShape extends ITools {
    primaryColor: string;
    secondaryColor: string;
    strokeOpacity: number;
    strokeWidth: number;
    fillOpacity: number;
    verticesNumber?: number;
}

export interface IShapeOptions extends ITools, IPreviewBox {
    wasSaved: boolean;
    savedStrokeWidth: number;
    savedTraceMode: number;
    savedVerticesNumber?: number;
}

