import { IModalData } from '../modal-window/IModalData';

export interface INewDrawingModalData extends IModalData {
    drawingHeightInput?: number;
    drawingWidthInput?: number;
    drawingColorInput?: string;
    drawingWidthPreview: number;
    drawingHeightPreview: number;
    color: string[];
}
