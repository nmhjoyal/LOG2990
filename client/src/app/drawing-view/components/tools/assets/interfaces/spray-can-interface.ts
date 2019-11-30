import { ITools } from './itools';

export interface ISpray {
    cx: number;
    cy: number;
    seed: number;
}
  
export interface ISprayCanOptions {
    wasSaved: boolean;
    savedDiameter: number;
    savedSprayPerSecond: number;
}
  
export interface ISprayPaint {
    sprays?: ISpray[];
    radius?: number;
}
  
export interface ISprayCan extends ITools {
    sprays: ISpray[];
    furthestX: number;
    furthestY: number;
    radius: number;
    primaryColour: string;
}
