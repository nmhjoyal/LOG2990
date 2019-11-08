import { Injectable } from '@angular/core';
import { ITools } from 'src/app/drawing-view/components/tools/assets/interfaces/itools';

@Injectable({
  providedIn: 'root',
})
export class DrawingStorageService {

  drawings: ITools[];

  constructor() {
    this.drawings = [];
  }

  saveDrawing(drawing: ITools): void {
    this.drawings.push(drawing);
  }

  emptyDrawings(): void {
    this.drawings.length = 0;
  }

}
