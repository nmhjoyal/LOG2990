import { Strings } from 'src/AppConstants/Strings';

export class LocalStorageService {

    setShowAgain(showAgain: string): void {
        localStorage.setItem(Strings.WELCOME_WINDOW_KEY, showAgain);
    }

    getShowAgain(): boolean {
        if (localStorage.getItem(Strings.WELCOME_WINDOW_KEY) !== null) {
            return localStorage.getItem(Strings.WELCOME_WINDOW_KEY) === Strings.TRUE;
        }
        localStorage.setItem(Strings.WELCOME_WINDOW_KEY, Strings.TRUE);
        return true;
    }
}
