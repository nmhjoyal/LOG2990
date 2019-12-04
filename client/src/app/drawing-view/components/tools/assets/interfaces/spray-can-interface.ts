import { ITools } from './itools';

export interface ISpray {
    cx: number;
    cy: number;
    seed: number;
}

export interface ISprayPaint {
    sprays?: ISpray[];
    radius?: number;
}

export interface ISprayCan extends ITools {
    sprays: ISpray[];
    radius: number;
}
