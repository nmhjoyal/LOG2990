import { ITools } from './itools';

export interface IDrawingTool extends ITools {
    points: string;
    strokeWidth: number;
    fill: string;
    strokeLinecap: string;
    strokeLinejoin: string;
    filter: string;
}
