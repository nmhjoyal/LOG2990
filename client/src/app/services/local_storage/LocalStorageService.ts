import { Inject, Injectable } from '@angular/core';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';

const WELCOME_WINDOW_KEY = 'showAgain';

@Injectable()
export class LocalStorageService {

    // Shape Handling attributes
    private rectangleSelected = false;
    private crayonSelected = false;
    private pinceauSelected = false;

    // Color service simulating attributes
    primaryColor = 'green';
    secondaryColor = 'rgb(76, 24, 199)';

    // Shape Storage
    rectangles: {x: number, y: number, width: number, height: number,
        primeColor: string, secondColor: string
        strokeOpacity: number, strokeWidth: number, fillOpacity: number}[] = [];

    lines: {points: string, color: string, strokeWidth: number, 
        fill:string, strokeLinecap:string, filter:string}[] = [];

    paints: {points: string, color: string, strokeWidth: number, 
            fill:string, strokeLinecap:string, filter:{baseFrequency:string, numOctaves:string, scale:string}}[] = [];

    filters: {baseFrequency:string, numOctaves:string, scale:string}[] = 
    [{baseFrequency:"0.2", numOctaves:"2", scale:"5"}, 
    {baseFrequency:"0.4", numOctaves:"6", scale:"3"},
    {baseFrequency:"0.6", numOctaves:"4", scale:"4"},
    {baseFrequency:"1.0", numOctaves:"5", scale:"3"},
    {baseFrequency:"0.9", numOctaves:"3", scale:"6"}]

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
        this.lines.length = 0;
    }

    reset(): void {
        this.rectangleSelected = false;
        this.crayonSelected = false;
    }

    chooseRectangle(): void {
        this.reset();
        this.rectangleSelected = true;
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
