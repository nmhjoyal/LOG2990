import { ITools } from './itools';

export interface IDrawingTool extends ITools {
    points: string;
    color: string;
    strokeWidth: number;
    fill: string;
    strokeLinecap: string;
    strokeLinejoin: string;
    filter: string;
}

export interface IDrawingToolOptions extends ITools{
    wasSaved: boolean;
    savedStrokeWidth: number;
    savedFilter: string;
}