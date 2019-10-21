import { IDrawing } from '../../../../../../../common/drawing-information/IDrawing';
import { ITag } from '../../../../../../../common/drawing-information/ITag';
import { IModalData } from '../modal-window/IModalData';

export interface ISaveModalData extends IModalData {
    drawing: IDrawing;
    displayedTags: ITag[];
}
