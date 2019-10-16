import { IDrawing } from 'src/app/services/drawing-storage/IDrawing';
import { IModalData } from '../../modal-window/IModalData';
import { ITag } from '../../save-window/ITag';

export interface IGalleryModalData extends IModalData {
    filterTags: ITag[];
    drawings: IDrawing[];
}
