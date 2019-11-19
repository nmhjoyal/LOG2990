import { ElementRef, Injectable} from '@angular/core';
@Injectable()
export class CanvasCommunicationService {
    canvas: ElementRef<HTMLCanvasElement>;
}
