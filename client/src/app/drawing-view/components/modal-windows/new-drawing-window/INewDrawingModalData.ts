import { IModalData } from '../modal-window/IModalData';

export interface INewDrawingModalData extends IModalData {
    drawingHeightInput?: number;
    drawingWidthInput?: number;
    drawingColourInput?: string;
    drawingWidthPreview: number;
    drawingHeightPreview: number;
    colour: string[];
}
