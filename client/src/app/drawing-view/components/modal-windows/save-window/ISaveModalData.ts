import { IDrawing } from 'src/app/services/drawing-storage/IDrawing';
import { IModalData } from '../modal-window/IModalData';
import { ITag } from './ITag';

export interface ISaveModalData extends IModalData {
    drawing: IDrawing;
    displayedTags: ITag[];
}
