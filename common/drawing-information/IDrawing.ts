import { ITag } from 'src/app/drawing-view/components/modal-windows/save-window/ITag';
import { ISVGPreview } from 'src/app/services/drawing-storage/ISVGPreview';

export interface IDrawing {
    name: string;
    preview: ISVGPreview;
    tags?: ITag[];
    timestamp: string;
    shapes: object[];
}
