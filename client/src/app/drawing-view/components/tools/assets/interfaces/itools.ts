import { IColourApplicator } from './colour-applicator-interface';
import { ILinePoints, IPath } from './drawing-tool-interface';
import { IErasedObjectsList } from './eraser-interface';
import { IDrag, IPolygon, IPreviewBox } from './shape-interface';
import { IStampReference } from './stamp-interface';
import { TextBox } from './text-interface';

export interface ITools extends IPreviewBox, ILinePoints, IPolygon, IStampReference, TextBox, IPath, IErasedObjectsList, IColourApplicator,
IDrag {
    id: string;
    pasteOffset?: number;
}
