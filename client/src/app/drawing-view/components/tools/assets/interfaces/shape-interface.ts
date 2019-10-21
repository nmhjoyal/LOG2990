import { ITools } from './itools';

export interface IPreviewBox {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface ILine extends ITools {
    points: string;
    color: string;
    strokeOpacity: number;
    strokeWidth: number;
    fill: string;
    pointWidth: number;
    strokeLinecap: string;
    strokeLinejoin: string;
    strokeDashArray: string;
}

export interface IShape extends IPreviewBox, ITools {
    primaryColor: string;
    secondaryColor: string;
    strokeOpacity: number;
    strokeWidth: number;
    fillOpacity: number;
    verticesNumber?: number;
}

export interface ILineOptions extends ITools {
    wasSaved: boolean;
    savedStrokeWidth: number;
    savedTraceMode: string;
    savedJunctionMode: string;
    savedPointWidth: number;
}

export interface IShapeOptions extends ITools {
    wasSaved: boolean;
    savedStrokeWidth: number;
    savedTraceMode: number;
    savedVerticesNumber?: number;
}
