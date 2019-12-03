import { Injectable } from '@angular/core';
import { ISavedDrawing } from '../../../../../common/drawing-information/IDrawing';
import { SelectorService } from '../selector-service/selector-service';

@Injectable({
  providedIn: 'root',
})
export class RotateSelectionService {

  protected angle: number;

  constructor(private selectorData: SelectorService) {
  }

  rotateAll(angle: number, shiftDown: boolean) {
    if (shiftDown) {
      this.selectorData.selectedObjects.forEach((drawing) => {
        const x = drawing.x + (drawing.width / 2);
        const y = drawing.y + (drawing.height / 2);
        this.rotate(drawing, angle, x, y, 0);
      });
    } else {
      const x = this.selectorData.topCornerX + (this.selectorData.MinWidth / 2);
      const y = this.selectorData.topCornerY + (this.selectorData.MinHeight / 2);
      this.selectorData.selectedObjects.forEach((drawing) => {
        this.rotate(drawing, angle, x, y, 1);
      });
    }
  }

  rotate(drawing: ISavedDrawing, angle: number, xCenter: number, yCenter: number, type: number): void {
    if (drawing.rotations && drawing.rotations[type].rotationAngle) {
      drawing.rotations[type].rotationAngle += angle;
      drawing.rotations[type].xCenter = xCenter;
      drawing.rotations[type].yCenter = yCenter;
    } else if (drawing.rotations) {
      drawing.rotations[type].rotationAngle = angle;
      drawing.rotations[type].xCenter = xCenter;
      drawing.rotations[type].yCenter = yCenter;
    }
  }
}
