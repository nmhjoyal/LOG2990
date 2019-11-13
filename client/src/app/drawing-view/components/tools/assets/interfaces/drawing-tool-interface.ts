import { ITools } from './itools';

export interface ILinePoints {
    points?: string;
}

export interface ILine extends ITools {
    colour: string;
    strokeOpacity: number;
    strokeWidth: number;
    fill: string;
    pointWidth: number;
    strokeLinecap: string;
    strokeLinejoin: string;
    strokeDashArray: string;
}

export interface ILineOptions extends ITools {
    wasSaved: boolean;
    savedStrokeWidth: number;
    savedTraceMode: string;
    savedJunctionMode: string;
    savedPointWidth: number;
}

export interface IDrawingTool extends ITools {
    colour: string;
    strokeWidth: number;
    fill: string;
    strokeLinecap: string;
    strokeLinejoin: string;
    filter: string;
}

export interface IDrawingToolOptions extends ITools {
    wasSaved: boolean;
    savedStrokeWidth: number;
    savedFilter: string;
    savedMaxWidth: number;
    savedMinWidth: number;
}

export interface IPlumeOptions extends IDrawingToolOptions {
    savedLineLenght: number;
    savedAngle: number;
}

export interface IPen extends ITools {
    colour: string;
    strokeLinecap: string;
}

export interface IComplexPath extends IPath {
    path: string;
    pathWidth: number;
}

export interface IPath {
    paths?: IComplexPath[];
}
