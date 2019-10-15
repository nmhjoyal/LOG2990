export interface IDrawingTool {
    id: string;
}

export interface IPreviewBox {
    x: number;
    y: number;
    width: number;
    height: number;
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
