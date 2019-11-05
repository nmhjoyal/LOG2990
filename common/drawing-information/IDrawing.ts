import { ITools } from '../../client/src/app/drawing-view/components/tools/assets/interfaces/itools';
import { ICanvasData } from '../../client/src/app/services/canvas-information/ICanvasData';
import { ITag } from './ITag';
import { IDrawingTool } from 'src/app/drawing-view/components/tools/assets/interfaces/drawing-tool-interface';
import { IStamp } from 'src/app/drawing-view/components/tools/assets/interfaces/stamp-interface';
import { IShape } from 'src/app/drawing-view/components/tools/assets/interfaces/shape-interface';

export interface IDrawing {
    name: string;
    tags?: ITag[];
    timestamp: string;
    shapes: ISavedDrawing[];
    canvas: ICanvasData;
}

export interface ISavedDrawing extends Partial<ITools>, Partial<IDrawingTool>, Partial<IStamp>, Partial<IShape> {
    id: string;
}
