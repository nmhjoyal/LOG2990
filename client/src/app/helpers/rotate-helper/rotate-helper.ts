import { Id } from 'src/app/drawing-view/components/tools/assets/constants/tool-constants';
import ParserHelper from 'src/app/services/parser-service/parser.service';
import { NumericalValues } from 'src/AppConstants/NumericalValues';
import { ISavedDrawing } from '../../../../../common/drawing-information/IDrawing';

export default class RotateHelper {

  static rotateOnItself(drawing: ISavedDrawing, angle: number): void {
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

  static calculatePosition(drawing: ISavedDrawing, angle: number, x: number, y: number): void {
    const angleRad = this.degreeToRad(angle);
    const newX = x + (drawing.x - x) * Math.cos(angleRad) - (drawing.y - y) * Math.sin(angleRad);
    const newY = y + (drawing.y - y) * Math.cos(angleRad) + (drawing.x - x) * Math.sin(angleRad);
    if ('points' in drawing) {
      ParserHelper.moveObject(newX - drawing.x, newY - drawing.y, drawing);
    } if (drawing.id === Id.POLYGON) {
      ParserHelper.moveObject(newX - drawing.x, newY - drawing.y, drawing);
    }
    if ('paths' in drawing) {
      ParserHelper.moveObject(newX - drawing.x, newY - drawing.y, drawing);
    } else {
      this.rotateOnItself(drawing, angle);
    }
    drawing.x = newX;
    drawing.y = newY;
  }

  static degreeToRad(angle: number): number {
    let angleRad = angle * (Math.PI / NumericalValues.ONE_EIGHTY);
    while (angleRad >= 2 * Math.PI) {
      angleRad -= 2 * Math.PI;
    }
    while (angleRad < 0) {
      angleRad += 2 * Math.PI;
    }
    return angleRad;
  }
}
