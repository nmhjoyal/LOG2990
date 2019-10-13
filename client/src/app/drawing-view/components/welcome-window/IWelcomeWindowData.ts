import { LocalStorageService } from 'src/app/services/local_storage/local-storage-service';
import { IModalData } from '../modal-window/IModalData';

export interface IWelcomeWindowData extends IModalData {
    storage?: LocalStorageService;
}
