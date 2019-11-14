import { ITools } from './itools';
import { ISavedDrawing } from '../../../../../../../../common/drawing-information/IDrawing';

export interface IEraser extends ITools {
    id: string;
    index: number;
    erasedObject: ITools;
}

export interface IErasedObjectsList {
    indexes?: number[];
    objects?: ISavedDrawing[];
}