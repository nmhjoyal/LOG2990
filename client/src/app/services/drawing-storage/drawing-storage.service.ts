import { Injectable } from '@angular/core';
import { ISavedDrawing } from '../../../../../common/drawing-information/IDrawing';

@Injectable({
  providedIn: 'root',
})
export class DrawingStorageService {

  drawings: ISavedDrawing[];

  constructor() {
    this.drawings = [];
  }

  saveDrawing(drawing: ISavedDrawing): void {
    this.drawings.push(drawing);
  }

  emptyDrawings(): void {
    this.drawings.length = 0;
  }

  isEmpty(): boolean {
    return !this.drawings.length;
  }

}
