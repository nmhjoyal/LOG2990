export interface IDrawingTool {
    id: string;
}

export interface IPreviewBox {
    x: number;
    y: number;
    width: number;
    height: number;
}

export class Coordinate {
    x: number;
    y: number;
}

export interface IPreviewLine {
    points: Coordinate[];
    stroke: string;
}

export interface ILine extends IPreviewLine, IDrawingTool {
    strokeOpacity: number;
    strokeWidth: number;
    pointWidth: number;
}

export interface IShape extends IPreviewBox, IDrawingTool {
    primaryColor: string;
    secondaryColor: string;
    strokeOpacity: number;
    strokeWidth: number;
    fillOpacity: number;
    verticesNumber?: number;
}

export interface ILineOptions extends IDrawingTool {
    wasSaved: boolean;
    savedStrokeWidth: number;
    savedPointMode: number;
    savedPointWidth: number;
}

export interface IShapeOptions extends IDrawingTool {
    wasSaved: boolean;
    savedStrokeWidth: number;
    savedTraceMode: number;
    savedVerticesNumber?: number;
}
