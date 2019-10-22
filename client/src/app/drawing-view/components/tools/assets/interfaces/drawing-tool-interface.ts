import { ITools } from './itools';

export interface Line {
    points?: string;
}

export interface ILine extends ITools {
    color: string;
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
    color: string;
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
}
