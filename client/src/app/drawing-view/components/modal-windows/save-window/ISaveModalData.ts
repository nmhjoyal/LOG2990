import { IModalData } from '../modal-window/IModalData';
import { ITag } from './ITag';

export interface ISaveModalData extends IModalData {
    name: string;
    savedTags?: ITag[];
    displayedTags: ITag[];
    drawings: object[]; // temp placeholder until shapes are saved
}
