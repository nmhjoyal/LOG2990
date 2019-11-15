import { ITools } from './itools';
// import { IShape } from './shape-interface';
/*
export interface IBucket extends IShape {
    //Empty?
}
*/
export interface IBucketOptions extends ITools {
    wasSaved: boolean;
    savedStrokeWidth: number;
    savedTolerance: number;
    savedTraceMode: number;
    savedMaxWidth: number;
    savedMinWidth: number;
}
