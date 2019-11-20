import { ElementRef, Injectable} from '@angular/core';
/*@Injectable()
export class CanvasCommunicationService {
    canvas: ElementRef<HTMLCanvasElement>;
}*/
// import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';

@Injectable()
export class CanvasCommunicationService {
    private canvas = new Subject<ElementRef<HTMLCanvasElement>>();
    canvasObservable = this.canvas.asObservable();

    getCanvas(): Observable<ElementRef> {
        // this.canvas.next(canvas);
        return this.canvasObservable;
    }
}
