import { Line } from './drawing-tool-interface';
import { IPreviewBox } from './shape-interface';

export class ITools implements IPreviewBox, Line {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    points: string;
}
