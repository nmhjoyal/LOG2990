import { Inject, Injectable } from '@angular/core';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';

const WELCOME_WINDOW_KEY = 'showAgain';

@Injectable()
export class LocalStorageService {
    constructor(@Inject(LOCAL_STORAGE) private storage: StorageService) { }

    setShowAgain(showAgain: boolean) {
        this.storage.set(WELCOME_WINDOW_KEY, showAgain);
    }

    getShowAgain() {
        if (this.storage.has(WELCOME_WINDOW_KEY)) {
            return this.storage.get(WELCOME_WINDOW_KEY);
        }
        this.storage.set(WELCOME_WINDOW_KEY, true);
        return true;
    }
}
