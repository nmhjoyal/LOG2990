import { ITools } from './itools';

export interface ISprays {
    cx: number;
    cy: number;
    seed: number;
}
  
export interface ISprayCanOptions {
    wasSaved: boolean;
    savedDiametre: number;
    savedSprayPerSecond: number;
}
  
export interface ISprayPaint {
    sprays?: ISprays[];
    radius?: number;
}
  
export interface ISprayCan extends ITools {
    sprays: ISprays[];
    furthestX: number;
    furthestY: number;
    radius: number;
    primaryColour: string;
}
