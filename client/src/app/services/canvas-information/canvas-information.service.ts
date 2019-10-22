import { Injectable } from '@angular/core';
import { ICanvasData } from './ICanvasData';

@Injectable({
  providedIn: 'root',
})

export class CanvasInformationService {
  data: ICanvasData;
}
