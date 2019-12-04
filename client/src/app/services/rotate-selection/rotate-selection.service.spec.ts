// tslint:
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

  it('#calculatePosition should call rewritePoints if the drawing has points and rotateOnItself when not', () => {
    const spyRewrite = spyOn(service, 'rewritePoints');
    const spyRotate = spyOn(service, 'rotateOnItself');
    service.calculatePosition(drawing, 0, 0, 0);
    expect(spyRotate).toHaveBeenCalled();
    const mockLine: ISavedDrawing = {
      id: 'mockLine',
      x: 10,
      y: 10,
      width: 10,
      height: 10,
      rotationAngle: 0,
      centerX: 0,
      centerY: 0,
      points: '',
    };
    service.calculatePosition(mockLine, 0, 0, 0);
    expect(spyRewrite).toHaveBeenCalled();
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
    const line: ISavedDrawing = { x: 4, y: 4, id: 'line', height: 2, width: 2, points: '4 4, 6 6' };
    // const drawing2: ITools = { x: 0, y: 0, id: Id.LINE, height: 2, width: 2, vertices: '0 0, 1 1' };
    // const drawing3: ITools = { x: 0, y: 0, id: Id.LINE, height: 2, width: 2, paths: [{ path: 'M1 4L5 6', pathWidth: 2 }] };
    service.rewritePoints(line, Math.PI, 5, 5);
    expect(line.points).toEqual('6 6, 4 4');
    service.rewritePoints(drawing, Math.PI, 5, 5);
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
    expect(drawing.rotationAngle).toEqual(2*ANGLE);
    expect(drawing.centerX).toEqual(15);
    expect(drawing.centerY).toEqual(15);
  });
});
