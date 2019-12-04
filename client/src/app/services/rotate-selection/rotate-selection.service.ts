import { Injectable } from '@angular/core';
import { NumericalValues } from 'src/AppConstants/NumericalValues';
import { ISavedDrawing } from '../../../../../common/drawing-information/IDrawing';
import { Id } from 'src/app/drawing-view/components/tools/assets/constants/tool-constants';
import { IComplexPath } from 'src/app/drawing-view/components/tools/assets/interfaces/drawing-tool-interface';

@Injectable({
  providedIn: 'root',
})
export class RotateSelectionService {

  constructor() {
    // empty block
  }

  rotateOnItself(drawing: ISavedDrawing, angle: number): void {
    if (drawing.id === Id.POLYGON || drawing.id === Id.ELLIPSE) {
      drawing.rotationAngle = drawing.rotationAngle ? drawing.rotationAngle + angle : angle;
      drawing.centerX = drawing.x;
      drawing.centerY = drawing.y;
    } else {
    drawing.rotationAngle = drawing.rotationAngle ? drawing.rotationAngle + angle : angle;
    drawing.centerX = drawing.x + (drawing.width / 2);
    drawing.centerY = drawing.y + (drawing.height / 2);
    }
  }

  calculatePosition(drawing: ISavedDrawing, angle: number, x: number, y: number): void {
    const angleRad = this.degreeToRad(angle);
    const newX = x + (drawing.x - x) * Math.cos(angleRad) - (drawing.y - y) * Math.sin(angleRad);
    const newY = y + (drawing.y - y) * Math.cos(angleRad) + (drawing.x - x) * Math.sin(angleRad);
    if ('points' in drawing) {
      this.rewritePoints(drawing, newX - drawing.x, newY - drawing.y);
    } else if (drawing.id === Id.POLYGON) {
      this.rewritePoints(drawing, newX - drawing.x, newY - drawing.y);
    }
    if ('paths' in drawing) {
      this.rewritePaths(drawing, newX - drawing.x, newY - drawing.y);
    } else {
      this.rotateOnItself(drawing, angle);
    }
    drawing.x = newX;
    drawing.y = newY;
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

  rewritePoints(drawing: ISavedDrawing, offX: number, offY: number): void {
    let splitPoints: string[] = [];
    if ('points' in drawing) {
      // tslint:disable-next-line: no-non-null-assertion because it is verified as defined
      splitPoints = drawing.points!.split(/[ ,]+/).filter(Boolean);
    }
    if (drawing.id === Id.POLYGON) {
      // tslint:disable-next-line: no-non-null-assertion because it is verified as defined
      splitPoints = drawing.vertices!.split(/[ ,]+/).filter(Boolean);
    }
    let newPoints = '';
    for (let i = 0; i < splitPoints.length; i += 2) {
      newPoints += (parseInt(splitPoints[i], 10) + offX).toString() + ' '
      + (parseInt(splitPoints[i + 1], 10) + offY).toString();
      if (i !== splitPoints.length - 2) {
        newPoints += ', ';
      }
    }
    drawing.points = newPoints;
    drawing.vertices = newPoints;
  }

  rewritePaths(drawing: ISavedDrawing, offX: number, offY: number): void {
    const newPaths: IComplexPath[] = [];
    if (drawing.paths) {
      for (const path of drawing.paths) {
        const pathMX = path.path.slice(1, path.path.indexOf(' '));
        const pathMY = path.path.slice(path.path.indexOf(' ') + 1, path.path.indexOf('L'));
        const pathLX = path.path.slice(path.path.indexOf('L') + 1, path.path.lastIndexOf(' '));
        const pathLY = path.path.slice(path.path.lastIndexOf(' ') + 1);
        newPaths.push({
          path: 'M' + (parseInt(pathMX, 10) + offX).toString() + ' ' + (parseInt(pathMY, 10) + offY).toString()
            + 'L' + (parseInt(pathLX, 10) + offX).toString() + ' ' + (parseInt(pathLY, 10) + offY).toString(),
          pathWidth: path.pathWidth,
        });
      }
    drawing.paths = newPaths;
    }
  }

}
