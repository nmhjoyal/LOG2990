import { ITools } from './itools';

export interface IErased extends ITools {
    id: string;
    index: number;
    erasedObject: ITools;
}
