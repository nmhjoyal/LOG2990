import { Inject, Injectable } from '@angular/core';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { AppConstants } from 'src/AppConstants';

const WELCOME_WINDOW_KEY = 'showAgain';

@Injectable()
export class LocalStorageService {

    // Shape Handling attributes
    private rectangleSelected: boolean;
    private colourApplicatorSelected: boolean;
    private crayonSelected: boolean;
    private paintSelected: boolean;

    // Color service simulating attributes
    primaryColor: string;
    secondaryColor: string;

    // Shape Storage
    rectangles: {x: number, y: number, width: number, height: number,
        primeColor: string, secondColor: string
        strokeOpacity: number, strokeWidth: number, fillOpacity: number}[] = [];

    constructor(@Inject(LOCAL_STORAGE) private storage: StorageService) {
        this.rectangleSelected = false;
        this.colourApplicatorSelected = false;
        this.crayonSelected = false;
        this.paintSelected = false;
        this.primaryColor = AppConstants.DEFAULT_PRIMARY_COLOUR;
        this.secondaryColor = AppConstants.DEFAULT_SECONDARY_COLOUR;
     }

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

    // Tool Handling methods
    reset(): void {
        this.rectangleSelected = false;
        this.colourApplicatorSelected = false;
    }

    chooseRectangle(): void {
        this.reset();
        this.rectangleSelected = true;
    }

    chooseColourApplicator(primaryColor: string, secondaryColor: string): void {
        this.reset();
        this.primaryColor = primaryColor;
        this.secondaryColor = secondaryColor;
        this.colourApplicatorSelected = true;
    }

    chooseCrayon(): void {
        this.reset();
        this.crayonSelected = true;
    }

    choosePaint(): void {
        this.reset();
        this.paintSelected = true;
    }

    chooseOther(): void {
        this.reset();
    }

    get isRectangle(): boolean {
        return this.rectangleSelected;
    }

    isColourApplicatorSelected(): boolean {
        return this.colourApplicatorSelected;
    }

    // Color service simulating (DELETE ONCE IMPLEMENTED WITH COLOR SERVICE)
    switchColor() {
        this.primaryColor = 'rgb('
                              + Math.floor(Math.random() * 255)
                              + ',' + Math.floor(Math.random() * 255)
                              + ','  + Math.floor(Math.random() * 255)
                              + ')';
        this.secondaryColor = 'rgb('
                                + Math.floor(Math.random() * 255)
                                + ',' + Math.floor(Math.random() * 255)
                                + ','  + Math.floor(Math.random() * 255)
                                + ')';
      }

    get PrimaryColor(): string {
        return this.primaryColor;
    }

    get SecondColor(): string {
        return this.secondaryColor;
    }

}
