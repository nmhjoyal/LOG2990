// tslint:disable:no-string-literal
// tslint:disable:no-magic-numbers
import { IComplexPath } from 'src/app/drawing-view/components/tools/assets/interfaces/drawing-tool-interface';
import ParserHelper from 'src/app/services/parser-service/parser.service';
import { ISavedDrawing } from '../../../../../common/drawing-information/IDrawing';
import RotateHelper from './rotate-helper';

describe('RotateSelectionService', () => {

  const drawing: ISavedDrawing = {
    id: 'mock',
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    rotationAngle: 0,
    centerX: 0,
    centerY: 0,
  };
  const line: ISavedDrawing = {
    x: 4,
    y: 4,
    id: 'line',
    height: 2,
    width: 2,
    points: '4 4, 6 6',
   };
  const polygon: ISavedDrawing = {
    x: 0,
    y: 0,
    id: 'polygon',
    height: 2,
    width: 2,
    vertices: '0 0, 1 1, 2 2',
  };
  const path: ISavedDrawing = {
    x: 0,
    y: 0,
    id: 'quill',
    height: 2,
    width: 2,
    paths: [{ path: 'M1 4L5 6', pathWidth: 2 }],
  };
  const ANGLE = 90;
  const DEGREE_TO_RAD = (Math.PI / 180);
  const BELOW_RANGE_ANGLE = -180;
  const ABOVE_RANGE_ANGLE = 720;

  it('#calculatePosition should call either moveObject or rotateOnItself', () => {
    const spyMove = spyOn(ParserHelper, 'moveObject');
    const spyRotate = spyOn(RotateHelper, 'rotateOnItself');
    RotateHelper.calculatePosition(drawing, 0, 0, 0);
    expect(spyRotate).toHaveBeenCalled();
    RotateHelper.calculatePosition(line, 0, 0, 0);
    expect(spyMove).toHaveBeenCalled();
    RotateHelper.calculatePosition(polygon, 0, 0, 0);
    expect(spyMove).toHaveBeenCalled();
    RotateHelper.calculatePosition(path, 0, 0, 0);
    expect(spyMove).toHaveBeenCalled();
  });

  it('#degreeToRad should return a value between 0 and 2*PI', () => {
    let angleRad: number;
    angleRad = RotateHelper.degreeToRad(ANGLE);
    expect(angleRad).toEqual(ANGLE * DEGREE_TO_RAD);

    angleRad = RotateHelper.degreeToRad(BELOW_RANGE_ANGLE);
    expect(angleRad).toEqual(Math.PI);

    angleRad = RotateHelper.degreeToRad(ABOVE_RANGE_ANGLE);
    expect(angleRad).toEqual(0);
  });

  it('#moveObject should give new values to the drawings points', () => {
    ParserHelper.moveObject(5, 5, line);
    expect(line.points).toEqual('9 9, 11 11');

    ParserHelper.moveObject(5, 5, polygon);
    expect(polygon.vertices).toEqual('5 5, 6 6, 7 7');

    ParserHelper.moveObject(5, 5, path);
    const newPath: IComplexPath[] = [{path: 'M6 9L10 11', pathWidth: 2}];
    expect(path.paths).toEqual(newPath);

    ParserHelper.moveObject(5, 5, drawing);
    expect(drawing.points).toEqual(undefined);

    ParserHelper.moveObject(5, 5, drawing);
    expect(drawing.paths).toEqual(undefined);
  });

  it('#rotateOnItself should give the right values', () => {
    drawing.x = 10;
    drawing.y = 10;
    drawing.width = 10;
    drawing.height = 10;
    RotateHelper.rotateOnItself(drawing, ANGLE);
    expect(drawing.rotationAngle).toEqual(ANGLE);
    expect(drawing.centerX).toEqual(15);
    expect(drawing.centerY).toEqual(15);
    RotateHelper.rotateOnItself(drawing, ANGLE);
    expect(drawing.rotationAngle).toEqual(2 * ANGLE);
    expect(drawing.centerX).toEqual(15);
    expect(drawing.centerY).toEqual(15);

    RotateHelper.rotateOnItself(polygon, ANGLE);
    expect(polygon.rotationAngle).toEqual(ANGLE);
    expect(polygon.centerX).toEqual(0);
    expect(polygon.centerY).toEqual(0);

    RotateHelper.rotateOnItself(polygon, ANGLE);
    expect(polygon.rotationAngle).toEqual(2 * ANGLE);
    expect(polygon.centerX).toEqual(0);
    expect(polygon.centerY).toEqual(0);
  });
});
