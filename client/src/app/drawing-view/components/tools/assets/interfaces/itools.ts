import { ILinePoints } from './drawing-tool-interface';
import { IPolygon, IPreviewBox } from './shape-interface';
import { IStampReference } from './stamp-interface';

export interface ITools extends IPreviewBox, ILinePoints, IPolygon, IStampReference {
    id: string;
}
