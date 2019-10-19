import { ISVGPreview } from 'src/app/services/drawing-storage/ISVGPreview';
import { IModalData } from '../../modal-window/IModalData';
import { ITag } from '../../../../../../../../common/drawing-information/ITag';

export interface IGalleryModalData extends IModalData {
    filterTags: ITag[];
    previews: ISVGPreview[];
}
