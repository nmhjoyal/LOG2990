import { IModalData } from '../modal-window/IModalData';
import { ElementRef } from '@angular/core';

export interface IExportData extends IModalData{
    canvasElement: ElementRef;
}
