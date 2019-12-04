import { ITools } from './itools';

export interface IStampReference {
    svgReference?: string;
}

export interface IStamp extends ITools, IStampReference {
    rotationAngle: number;
    scaleFactor: number;
    primaryColour: string;
    centerX: number;
    centerY: number;
    svgReference?: string;
}

export interface IStampOptions extends ITools {
    wasSaved: boolean;
    savedScaleFactor: number;
    savedAngle: number;
}
