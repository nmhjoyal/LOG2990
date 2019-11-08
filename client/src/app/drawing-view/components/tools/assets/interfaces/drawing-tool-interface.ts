import { ITools } from './itools';
import { IPreviewBox } from './shape-interface';

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

export interface IDrawingTool extends ITools, ILinePoints, IPreviewBox {
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
}
