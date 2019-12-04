// tslint:disable:no-string-literal
// tslint:disable:no-magic-numbers
import { IComplexPath } from 'src/app/drawing-view/components/tools/assets/interfaces/drawing-tool-interface';
import { ISavedDrawing } from '../../../../../common/drawing-information/IDrawing';
import { RotateSelectionService } from './rotate-selection.service';

describe('RotateSelectionService', () => {

  let service: RotateSelectionService;
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

  beforeEach(() => {
    service = new RotateSelectionService();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#calculatePosition should call either rewritePoints, rewritePaths or rotateOnItself', () => {
    const spyRewritePoints = spyOn(service, 'rewritePoints');
    const spyRewritePaths = spyOn(service, 'rewritePaths');
    const spyRotate = spyOn(service, 'rotateOnItself');
    service.calculatePosition(drawing, 0, 0, 0);
    expect(spyRotate).toHaveBeenCalled();
    service.calculatePosition(line, 0, 0, 0);
    expect(spyRewritePoints).toHaveBeenCalled();
    service.calculatePosition(path, 0, 0, 0);
    expect(spyRewritePaths).toHaveBeenCalled();
  });

  it('#degreeToRad should return a value between 0 and 2*PI', () => {
    let angleRad: number;
    angleRad = service.degreeToRad(ANGLE);
    expect(angleRad).toEqual(ANGLE * DEGREE_TO_RAD);

    angleRad = service.degreeToRad(BELOW_RANGE_ANGLE);
    expect(angleRad).toEqual(Math.PI);

    angleRad = service.degreeToRad(ABOVE_RANGE_ANGLE);
    expect(angleRad).toEqual(0);
  });

  it('#rewritePoints should give new values to the drawings points', () => {
    service.rewritePoints(line, 5, 5);
    expect(line.points).toEqual('9 9, 11 11');

    service.rewritePoints(polygon, 5, 5);
    expect(polygon.vertices).toEqual('5 5, 6 6, 7 7');

    service.rewritePaths(path, 5, 5);
    const newPath: IComplexPath[] = [{path: 'M6 9L10 11', pathWidth: 2}];
    expect(path.paths).toEqual(newPath);

    service.rewritePoints(drawing, 5, 5);
    expect(drawing.points).toEqual('');
  });

  it('#rotateOnItself should give the right values', () => {
    drawing.x = 10;
    drawing.y = 10;
    drawing.width = 10;
    drawing.height = 10;
    service.rotateOnItself(drawing, ANGLE);
    expect(drawing.rotationAngle).toEqual(ANGLE);
    expect(drawing.centerX).toEqual(15);
    expect(drawing.centerY).toEqual(15);
    service.rotateOnItself(drawing, ANGLE);
    expect(drawing.rotationAngle).toEqual(2 * ANGLE);
    expect(drawing.centerX).toEqual(15);
    expect(drawing.centerY).toEqual(15);

    service.rotateOnItself(polygon, ANGLE);
    expect(polygon.rotationAngle).toEqual(ANGLE);
    expect(polygon.centerX).toEqual(0);
    expect(polygon.centerY).toEqual(0);

    service.rotateOnItself(polygon, ANGLE);
    expect(polygon.rotationAngle).toEqual(2 * ANGLE);
    expect(polygon.centerX).toEqual(0);
    expect(polygon.centerY).toEqual(0);
  });
});
