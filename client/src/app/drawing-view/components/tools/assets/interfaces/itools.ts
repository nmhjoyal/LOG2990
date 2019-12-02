import { IColourApplicator } from './colour-applicator-interface';
import { ILinePoints, IPath } from './drawing-tool-interface';
import { IErasedObjectsList } from './eraser-interface';
import { IColour, IPolygon, IPreviewBox } from './shape-interface';
import { ISprayPaint } from './spray-can-interface';
import { IStampReference } from './stamp-interface';
import { TextBox } from './text-interface';

export interface ITools extends IPreviewBox, ILinePoints, IPolygon, IStampReference,
TextBox, IPath, IErasedObjectsList, IColourApplicator, ISprayPaint, Partial<IColour> {
    id: string;
    pasteOffset?: number;
}
