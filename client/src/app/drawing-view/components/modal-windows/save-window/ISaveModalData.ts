import { IModalData } from '../modal-window/IModalData';

export interface ISaveModalData extends IModalData {
    name: string;
    tags?: string[];
}
