import { ITools } from '../../client/src/app/drawing-view/components/tools/assets/interfaces/itools';
import { ICanvasData } from '../../client/src/app/services/canvas-information/ICanvasData';
import { ISVGPreview } from './ISVGPreview';
import { ITag } from './ITag';

export interface IDrawing {
    name: string;
    preview: ISVGPreview;
    tags?: Set<ITag>;
    timestamp: string;
    shapes: ITools[];
    canvas: ICanvasData;
}
