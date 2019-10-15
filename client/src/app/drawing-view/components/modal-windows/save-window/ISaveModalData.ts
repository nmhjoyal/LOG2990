import { IModalData } from '../modal-window/IModalData';

export interface ISaveModalData extends IModalData {
    name: string;
    savedTags?: string[];
    displayedTags: string[];
    drawings: object[]; // temp placeholder until shapes are saved
}
