import { ITools } from '../../client/src/app/drawing-view/components/tools/assets/interfaces/itools';
import { ICanvasData } from '../../client/src/app/services/canvas-information/ICanvasData';
import { ITag } from './ITag';

export interface IDrawing {
    name: string;
    tags?: ITag[];
    timestamp: string;
    shapes: ITools[];
    canvas: ICanvasData;
}
