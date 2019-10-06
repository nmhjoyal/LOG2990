import { LocalStorageService } from 'src/app/services/local_storage/LocalStorageService';
import { IModalData } from '../IModalData';

export interface IWelcomeWindowData extends IModalData {
    storage?: LocalStorageService;
}
