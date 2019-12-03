import { IDrawingTool } from '../../client/src/app/drawing-view/components/tools/assets/interfaces/drawing-tool-interface';
import { ITools } from '../../client/src/app/drawing-view/components/tools/assets/interfaces/itools';
import { IShape } from '../../client/src/app/drawing-view/components/tools/assets/interfaces/shape-interface';
import { IStamp } from '../../client/src/app/drawing-view/components/tools/assets/interfaces/stamp-interface';
import { IText } from '../../client/src/app/drawing-view/components/tools/assets/interfaces/text-interface';
import { ICanvasData } from '../../client/src/app/services/canvas-information/ICanvasData';
import { ITag } from './ITag';

export interface IDrawing {
    name: string;
    tags?: ITag[];
    timestamp: string;
    shapes: ISavedDrawing[];
    canvas: ICanvasData;
}

export interface IRotation {
    rotationAngle: number;
    xCenter: number;
    yCenter: number;
}

export interface ISavedDrawing extends ITools, Partial<IDrawingTool>, Partial<IStamp>, Partial<IShape>, Partial<IText>, Partial<IRotation> {
    id: string;
    x: number;
    y: number;
    height: number;
    width: number;
    strokeWidth?: number;
    svgReference?: string;
}


