import { ITools } from './itools';

export interface Line {
    points: string;
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
