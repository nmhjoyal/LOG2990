import { LocalStorageService } from 'src/app/services/local_storage/LocalStorageService';
import { IModalData } from '../ModalData';

export interface IWelcomeWindowData extends IModalData {
    storage?: LocalStorageService;
}
