import { ITools } from './itools';

export interface IEraser extends ITools {
    id: string;
    index: number;
    erasedObject: ITools;
}
