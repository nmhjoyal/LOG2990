import { LocalStorageService } from 'src/app/services/local_storage/LocalStorageService';
import { ModalData } from '../ModalData';

export interface WelcomeWindowData extends ModalData {
    storage?: LocalStorageService;
}
