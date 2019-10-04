const WELCOME_WINDOW_KEY = 'showAgain';

export class LocalStorageService {

    setShowAgain(showAgain: string): void {
        localStorage.setItem(WELCOME_WINDOW_KEY, showAgain);
    }

    getShowAgain(): boolean {
        if (localStorage.getItem(WELCOME_WINDOW_KEY) !== null) {
            return localStorage.getItem(WELCOME_WINDOW_KEY) === 'true';
        }
        localStorage.setItem(WELCOME_WINDOW_KEY, 'true');
        return true;
    }
}
