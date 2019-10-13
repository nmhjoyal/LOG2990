import { Inject, Injectable } from '@angular/core';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { Strings } from 'src/AppConstants/Strings';

@Injectable()
export class LocalStorageService {
    constructor(@Inject(LOCAL_STORAGE) private storage: StorageService) { }

    setShowAgain(showAgain: boolean): void {
        this.storage.set(Strings.WELCOME_WINDOW_KEY, showAgain);
    }

    getShowAgain(): boolean {
        if (this.storage.has(Strings.WELCOME_WINDOW_KEY)) {
            return this.storage.get(Strings.WELCOME_WINDOW_KEY);
        }
        this.storage.set(Strings.WELCOME_WINDOW_KEY, true);
        return true;
    }
}
