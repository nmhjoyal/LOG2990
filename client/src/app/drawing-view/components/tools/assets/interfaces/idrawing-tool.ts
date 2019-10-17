import { ITools } from './itools';

export class IDrawingTool extends ITools {
    points: string;
    strokeWidth: number;
    fill: string;
    strokeLinecap: string;
    strokeLinejoin: string;
    filter: string;
}
