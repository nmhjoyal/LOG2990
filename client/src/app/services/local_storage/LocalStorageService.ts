import { Inject, Injectable } from '@angular/core';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';

const WELCOME_WINDOW_KEY = 'showAgain';

@Injectable()
export class LocalStorageService {

    // Shape Handling attributes
    rectangleSelected = false;

    // Color service simulating attributes
    primaryColor = 'green';
    secondaryColor = 'rgb(76, 24, 199)';

    // Shape Storage
    rectangles: {x: number, y: number, width: number, height: number,
        primeColor: string, secondColor: string
        strokeOpacity: number, strokeWidth: number, fillOpacity: number}[] = [];

    constructor(@Inject(LOCAL_STORAGE) private storage: StorageService) {

    }

    setShowAgain(showAgain: boolean): void {
        this.storage.set(WELCOME_WINDOW_KEY, showAgain);
    }

    getShowAgain(): boolean {
        if (this.storage.has(WELCOME_WINDOW_KEY)) {
            return this.storage.get(WELCOME_WINDOW_KEY);
        }
        this.storage.set(WELCOME_WINDOW_KEY, true);
        return true;
    }

    // Tool Handling methods
    clear(): void {
        this.reset();
        this.rectangles.length = 0;
    }

    reset(): void {
        this.rectangleSelected = false;
    }

    chooseRectangle(): void {
        this.reset();
        this.rectangleSelected = true;
    }

    chooseOther(): void {
        this.reset();
    }

    get isRectangle(): boolean {
        return this.rectangleSelected;
    }

    get PrimaryColor(): string {
        return this.primaryColor;
    }

    get SecondColor(): string {
        return this.secondaryColor;
    }

}
