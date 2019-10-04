import { LocalStorageService } from 'src/app/services/local_storage/local-storage-service';
import { ModalData } from '../ModalData';

export interface WelcomeWindowData extends ModalData {
    storage?: LocalStorageService;
}
