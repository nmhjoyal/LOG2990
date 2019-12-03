import { Injectable } from '@angular/core';
import { ISavedDrawing } from '../../../../../common/drawing-information/IDrawing';
import { NumericalValues } from 'src/AppConstants/NumericalValues';

@Injectable({
  providedIn: 'root',
})
export class RotateSelectionService {
  constructor() {
    // empty block
  }

  rotateOnItself(drawing: ISavedDrawing, angle: number): void {
    drawing.rotationAngle = drawing.rotationAngle ? drawing.rotationAngle + angle : angle;
    drawing.centerX = drawing.x + (drawing.width / 2);
    drawing.centerY = drawing.y + (drawing.height / 2);
  }

  calculatePosition(drawing: ISavedDrawing, angle: number, x: number, y: number): void {
    const angleRad = this.degreeToRad(angle);
    if ('points' in drawing) {
      this.rewritePoints(drawing, angleRad, x, y);
    } else {
      this.rotateOnItself(drawing, angle);
      drawing.x = x + (drawing.x - x) * Math.cos(angleRad) - (drawing.y - y) * Math.sin(angleRad);
      drawing.y = y + (drawing.y - y) * Math.cos(angleRad) + (drawing.x - x) * Math.sin(angleRad);
    }
  }

  degreeToRad(angle: number): number {
    let angleRad = angle * (Math.PI / NumericalValues.ONE_EIGHTY);
    while (angleRad >= 2 * Math.PI) {
      angleRad -= 2 * Math.PI;
    }
    while (angleRad < 0) {
      angleRad += 2 * Math.PI;
    }
    return angleRad;
  }

  rewritePoints(drawing: ISavedDrawing, angle: number, x: number, y: number) {
    let splitPoints: string[] = [];
    if ('points' in drawing) {
      // tslint:disable-next-line: no-non-null-assertion because it is verified as defined
      splitPoints = drawing.points!.split(/[ ,]+/).filter(Boolean);
    }
    let newPoints = '';
    for (let i = 0; i < splitPoints.length; i += 2) {
      const oldX = parseInt(splitPoints[i], 10);
      const oldY = parseInt(splitPoints[i + 1], 10);
      newPoints += (x + (oldX - x) * Math.cos(angle) - (oldY - y) * Math.sin(angle)).toString() + ','
                + (y + (oldY - y) * Math.cos(angle) - (oldX - x) * Math.sin(angle)).toString() + ' ';
    }
    drawing.points = newPoints;
  }

}
