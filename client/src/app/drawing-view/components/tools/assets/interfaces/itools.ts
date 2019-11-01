import { Line } from './drawing-tool-interface';
import { IPolygon, IPreviewBox } from './shape-interface';

export interface ITools extends IPreviewBox, Line, IPolygon {
    id: string;
    // transform: SVGGraphicsElement;
}
