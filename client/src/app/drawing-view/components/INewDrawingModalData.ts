export interface INewDrawingModalData {
    title: string;
    drawingHeightInput?: number;
    drawingWidthInput?: number;
    drawingHeight: number;
    drawingWidth: number;
    drawingColorInput?: string;
    drawingColor: string;
    canvasIsDrawnOn: boolean;
    drawingWidthPreview: number;
    drawingHeightPreview: number;
}
