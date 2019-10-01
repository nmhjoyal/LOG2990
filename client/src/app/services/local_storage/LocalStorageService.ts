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
    private pinceauSelected: boolean;

    // Color service simulating attributes
    primaryColor: string;
    secondaryColor: string;

    // Shape Storage
    rectangles: {x: number, y: number, width: number, height: number,
        primeColor: string, secondColor: string
        strokeOpacity: number, strokeWidth: number, fillOpacity: number}[] = [];

    lines: {points: string, color: string, strokeWidth: number,
        fill: string, strokeLinecap: string, filter: string}[] = [];

    constructor(@Inject(LOCAL_STORAGE) private storage: StorageService) {
        this.rectangleSelected = false;
        this.colourApplicatorSelected = false;
        this.crayonSelected = false;
        this.pinceauSelected = false;
        this.primaryColor = AppConstants.DEFAULT_PRIMARY_COLOUR;
        this.secondaryColor = AppConstants.DEFAULT_SECONDARY_COLOUR;
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
        this.lines.length = 0;
    }

    reset(): void {
        this.rectangleSelected = false;
        this.colourApplicatorSelected = false;
        this.crayonSelected = false;
        this.pinceauSelected = false;
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

    choosePinceau(): void {
        this.reset();
        this.pinceauSelected = true;
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

    get isCrayon(): boolean {
        return this.crayonSelected;
    }

    get isPinceau(): boolean {
        return this.pinceauSelected;
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
