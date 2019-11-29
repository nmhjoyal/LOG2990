import { IColourApplicator } from './colour-applicator-interface';
import { ILinePoints, IPath } from './drawing-tool-interface';
import { IErasedObjectsList } from './eraser-interface';
import { IPolygon, IPreviewBox, IColour } from './shape-interface';
import { IStampReference } from './stamp-interface';
import { TextBox } from './text-interface';
import { ISprayPaint } from './spray-can-interface';

export interface ITools extends IPreviewBox, ILinePoints, IPolygon, IStampReference, 
TextBox, IPath, IErasedObjectsList, IColourApplicator, ISprayPaint, Partial<IColour> {
    id: string;
    pasteOffset?: number;
}
