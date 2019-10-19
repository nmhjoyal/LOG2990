import { ISVGPreview } from 'src/app/services/drawing-storage/ISVGPreview';
import { ITag } from './ITag';

export interface IDrawing {
    name: string;
    preview: ISVGPreview;
    tags?: ITag[];
    timestamp: string;
    shapes: object[];
}
