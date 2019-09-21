import { CookieService } from 'ngx-cookie-service';
import { ModalData } from '../ModalData';

export interface WelcomeWindowData extends ModalData {
    cookie?: CookieService;
}
