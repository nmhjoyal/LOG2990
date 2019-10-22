import { Line } from './drawing-tool-interface';
import { IPreviewBox } from './shape-interface';

export interface ITools extends IPreviewBox, Line {
    id: string;
}
