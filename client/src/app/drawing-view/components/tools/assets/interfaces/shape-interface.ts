import { ITools } from './itools';

export interface IPoint {
    x: number;
    y: number;
}

export interface IPreviewBox extends IPoint {
    width: number;
    height: number;
}

export interface IPolygon {
    vertices?: string;
}

export interface IColour {
    primaryColour: string;
    fillOpacity: number;
    secondaryColour: string;
}

export interface IShape extends ITools {
    primaryColour: string;
    secondaryColour: string;
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

export interface IDrag {
    offsetX?: number;
    offsetY?: number;
}
