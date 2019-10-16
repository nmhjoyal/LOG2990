import { ITag } from 'src/app/drawing-view/components/modal-windows/save-window/ITag';
import { ISVGPreview } from './ISVGPreview';

export interface IDrawing {
    name: string;
    preview: ISVGPreview;
    tags?: ITag[];
    timestamp: string;
    shapes: object[];
}
