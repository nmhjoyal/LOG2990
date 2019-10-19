import { IDrawing } from '../../../../../../../common/drawing-information/IDrawing';
import { IModalData } from '../modal-window/IModalData';
import { ITag } from '../../../../../../../common/drawing-information/ITag';

export interface ISaveModalData extends IModalData {
    drawing: IDrawing;
    displayedTags: ITag[];
}
