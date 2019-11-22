import { ILinePoints, IPath } from './drawing-tool-interface';
import { IErasedObjectsList } from './erased-interface';
import { IPolygon, IPreviewBox } from './shape-interface';
import { IStampReference } from './stamp-interface';
import { TextBox } from './text-interface';
import { ISprayPaint } from '../../spray-can/spray-can.component';

export interface ITools extends IPreviewBox, ILinePoints, IPolygon, IStampReference, TextBox, IPath, IErasedObjectsList, ISprayPaint {
    id: string;
    pasteOffset?: number;
}
