export interface IDrawingTool {
    id: string;
}

export interface IPreviewBox {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface IPreviewLine {
    x1: number;
    x2: number;
    y1: number;
    y2: number;
}

export interface IShape extends IPreviewBox, IPreviewLine, IDrawingTool {
    primaryColor: string;
    secondaryColor: string;
    strokeOpacity: number;
    strokeWidth: number;
    fillOpacity: number;
    nVertex?: number;
}

export interface IShapeOptions extends IDrawingTool {
    wasSaved: boolean;
    savedStrokeWidth: number;
    savedTraceMode: number;
    savedNVertex?: number;
}
