import { ITools } from './itools';

export interface IPreviewBox {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface IShape extends IPreviewBox, ITools {
    primaryColor: string;
    secondaryColor: string;
    strokeOpacity: number;
    strokeWidth: number;
    fillOpacity: number;
    verticesNumber?: number;
}

export interface IShapeOptions extends ITools {
    wasSaved: boolean;
    savedStrokeWidth: number;
    savedTraceMode: number;
    savedVerticesNumber?: number;
}
