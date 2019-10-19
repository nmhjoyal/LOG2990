import { ISVGPreview } from './ISVGPreview';
import { ITag } from './ITag';

export interface IDrawing {
    name: string;
    preview: ISVGPreview;
    tags?: ITag[];
    timestamp: string;
    shapes: object[];
}
