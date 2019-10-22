import { ITools } from './itools';

export interface IStamp extends ITools {
    svgReference: string;
    angle: number;
    scaleFactor: number;
    primaryColour: string;
}

export interface IStampOptions extends ITools {
    wasSaved: boolean;
    savedScaleFactor: number;
    savedAngle: number;
}
