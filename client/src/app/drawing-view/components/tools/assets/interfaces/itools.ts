import { ILinePoints, IPath } from './drawing-tool-interface';
import { IErasedObjectsList } from './eraser-interface';
import { IPolygon, IPreviewBox } from './shape-interface';
import { IStampReference } from './stamp-interface';
import { TextBox } from './text-interface';
import { IColourApplicator } from './colour-applicator-interface';

export interface ITools extends IPreviewBox, ILinePoints, IPolygon, IStampReference, TextBox, IPath, IErasedObjectsList, IColourApplicator {
    id: string;
    pasteOffset?: number;
}
