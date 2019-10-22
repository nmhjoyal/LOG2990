import { ITools } from './itools';

export interface IStamp extends ITools {
    svgReference: string;
    angle: number;
    scaleFactor: number;
    primaryColour: string;
    centerX: number;
    centerY: number;
}

export interface IStampOptions extends ITools {
    wasSaved: boolean;
    savedScaleFactor: number;
    savedAngle: number;
}
