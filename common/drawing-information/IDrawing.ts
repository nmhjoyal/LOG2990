import { IDrawingTool } from '../../client/src/app/drawing-view/components/tools/assets/interfaces/shape-interface';
import { ICanvasData } from '../../client/src/app/services/canvas-information/ICanvasData';
import { ISVGPreview } from './ISVGPreview';
import { ITag } from './ITag';

export interface IDrawing {
    name: string;
    preview: ISVGPreview;
    tags?: ITag[];
    timestamp: string;
    shapes: IDrawingTool[];
    canvas: ICanvasData;
}
