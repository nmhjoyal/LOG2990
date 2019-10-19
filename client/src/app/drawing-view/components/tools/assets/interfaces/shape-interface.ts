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
    y1: number;
   // y1: number;
   // y2: number;
}

export interface ILine extends IPreviewLine, IDrawingTool {
    primaryColor: string;
    strokeOpacity: number;
    strokeWidth: number;
}

export interface IShape extends IPreviewBox, IDrawingTool {
    primaryColor: string;
    secondaryColor: string;
    strokeOpacity: number;
    strokeWidth: number;
    fillOpacity: number;
    verticesNumber?: number;
}

export interface IShapeOptions extends IDrawingTool {
    wasSaved: boolean;
    savedStrokeWidth: number;
    savedTraceMode: number;
    savedVerticesNumber?: number;
}
