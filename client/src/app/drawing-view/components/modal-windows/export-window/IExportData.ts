import { ElementRef } from '@angular/core';
import { IModalData } from '../modal-window/IModalData';

export interface IExportData extends IModalData {
    canvasElement: ElementRef<SVGElement>;
}
