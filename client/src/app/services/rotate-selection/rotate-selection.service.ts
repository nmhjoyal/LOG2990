import { Injectable } from '@angular/core';
import { SelectorService } from '../selector-service/selector-service';
import { ISavedDrawing } from '../../../../../common/drawing-information/IDrawing';

@Injectable({
  providedIn: 'root',
})
export class RotateSelectionService {

  protected angle: number;

  constructor(private selectorData: SelectorService) {
  }

  rotateAll(angle: number, shiftDown: boolean): void {
    if (shiftDown) {
      this.selectorData.selectedObjects.forEach((drawing) => {
        const x = drawing.x + (drawing.width / 2);
        const y = drawing.y + (drawing.height / 2);
        this.rotate(drawing, angle, x, y);
      });
    } else {
      const x = this.selectorData.topCornerX + (this.selectorData.MinWidth / 2);
      const y = this.selectorData.topCornerY + (this.selectorData.MinHeight / 2);
      this.selectorData.selectedObjects.forEach((drawing) => {
        this.rotate(drawing, angle, x, y);
      });
    }
  }

  rotate(drawing: ISavedDrawing, angle: number, xCenter: number, yCenter: number): void {
    drawing.rotationAngle = angle;
    drawing.xCenter = xCenter;
    drawing.yCenter = yCenter;
  }

}
