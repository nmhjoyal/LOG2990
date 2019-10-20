import { ISVGPreview } from '../../../../../../../../common/drawing-information/ISVGPreview';
import { ITag } from '../../../../../../../../common/drawing-information/ITag';
import { IModalData } from '../../modal-window/IModalData';

export interface IGalleryModalData extends IModalData {
    filterTags: Set<ITag>;
    previews: ISVGPreview[];
}
