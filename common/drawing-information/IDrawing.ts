import { IDrawingTool } from 'src/app/drawing-view/components/tools/assets/interfaces/shape-interface';
import { ICanvasData } from 'src/app/services/canvas-information/ICanvasData';
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
