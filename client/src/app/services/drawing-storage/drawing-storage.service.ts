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
    drawing.rotations = [];
    drawing.rotations[0].rotationAngle = 0;
    drawing.rotations[0].xCenter = 0;
    drawing.rotations[0].yCenter = 0;
    drawing.rotations[1].rotationAngle = 0;
    drawing.rotations[1].xCenter = 0;
    drawing.rotations[1].yCenter = 0;
    this.drawings.push(drawing);
  }

  emptyDrawings(): void {
    this.drawings.length = 0;
  }

  isEmpty(): boolean {
    return !this.drawings.length;
  }

}
