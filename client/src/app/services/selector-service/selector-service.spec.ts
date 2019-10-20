import { ITools } from 'src/app/drawing-view/components/tools/assets/interfaces/itools';
import { Id } from 'src/app/drawing-view/components/tools/assets/tool-constants';
import { SelectorService } from './selector-service';

describe('SelectorService', () => {
  let service: SelectorService;
  const FIFTY = 50;
  const FORTY = 40;
  const ONE_HUNDRED = 100;
  const TWICE = 2;

  beforeEach(() => {
    service = new SelectorService();
  });

  it('should be created with correct initialized values', () => {
    expect(service).toBeTruthy();
    expect(service.selectedObjects).toBeDefined();
    expect(service.topCornerX).toEqual(0);
    expect(service.topCornerY).toEqual(0);
    expect(service.bottomCornerX).toEqual(0);
    expect(service.bottomCornerY).toEqual(0);
    expect(service.width).toEqual(0);
    expect(service.height).toEqual(0);
  });

  it('should create selector box as drawing', () => {
    let drawing: ITools;
    drawing = { x: FIFTY, y: FIFTY, width: FIFTY, height: FIFTY, id: Id.RECTANGLE, points: ''};
    service.setBoxToDrawing(drawing);
    expect(service.topCornerX).toEqual(drawing.x);
    expect(service.topCornerY).toEqual(drawing.y);
    expect(service.MinWidth).toEqual(drawing.width);
    expect(service.MinHeight).toEqual(drawing.height);
    expect(service.bottomCornerX).toEqual(drawing.x + drawing.width);
    expect(service.bottomCornerY).toEqual(drawing.y + drawing.height);
  });

  it('should check for items, add when not in reverse and delete if in reverse', () => {
    spyOn(service, 'updateSelectorShape').and.callFake(() => { return; });
    spyOn(service, 'objectInBox').and.returnValue(true);
    const drawing1 = { x: FIFTY, y: FORTY, width: FIFTY, height: FIFTY, id: Id.RECTANGLE, points: '' };
    const drawing2 = { x: FORTY, y: FORTY, width: FIFTY, height: FIFTY, id: Id.RECTANGLE, points: '' };
    const drawings = [];
    drawings.push(drawing1);
    drawings.push(drawing2);
    service.selectedObjects.add(drawing1);
    service.selectedObjects.add(drawing2);
    const box = { x: FIFTY, y: FIFTY, width: FIFTY, height: FIFTY };
    service.checkForItems(true, drawings, box);
    expect(service.selectedObjects.size).toEqual(0);
    service.checkForItems(false, drawings, box);
    expect(service.selectedObjects.size).toEqual(TWICE);
  });

  it('should update corners depending on direction or drag', () => {
    service.updateCorners(FIFTY, FORTY, FORTY, FIFTY, ONE_HUNDRED, ONE_HUNDRED);
    expect(service.bottomCornerX).toEqual(FIFTY);
    expect(service.bottomCornerY).toEqual(FIFTY);
    expect(service.topCornerX).toEqual(FIFTY + ONE_HUNDRED);
    expect(service.topCornerY).toEqual(FIFTY + ONE_HUNDRED);
  });

  it('should update corners depending on drawing dimensions', () => {
    let drawing: ITools;
    drawing = { x: FIFTY, y: FORTY, width: FIFTY, height: FIFTY, id: Id.RECTANGLE, points: '' };
    service.topCornerX = FORTY;
    service.topCornerY = FIFTY;
    service.width = FORTY;
    service.height = ONE_HUNDRED;
    service.updateSelectorShape(drawing);
    expect(service.topCornerX).toEqual(FORTY);
    expect(service.topCornerY).toEqual(drawing.y);
    expect(service.width).toEqual(drawing.x + drawing.width);
    expect(service.height).toEqual(ONE_HUNDRED);
    drawing = { x: FORTY, y: FIFTY, width: FIFTY, height: FIFTY, id: Id.RECTANGLE, points: '' };
    service.topCornerX = FIFTY;
    service.topCornerY = FORTY;
    service.width = ONE_HUNDRED;
    service.height = FORTY;
    service.updateSelectorShape(drawing);
    expect(service.topCornerX).toEqual(drawing.x);
    expect(service.topCornerY).toEqual(FORTY);
    expect(service.width).toEqual(ONE_HUNDRED);
    expect(service.height).toEqual(drawing.y + drawing.height);
  });

  it('should recalculate selector shape with list of selected items', () => {
    let drawing: ITools;
    drawing = { x: FIFTY, y: FORTY, width: FIFTY, height: FIFTY, id: Id.RECTANGLE, points: '' };
    service.selectedObjects.add(drawing);
    drawing = { x: FORTY, y: FORTY, width: FIFTY, height: FIFTY, id: Id.RECTANGLE, points: ''};
    service.selectedObjects.add(drawing);
    spyOn(service, 'updateSelectorShape').and.callFake(() => { return; });
    service.recalculateShape(ONE_HUNDRED, ONE_HUNDRED);
    expect(service.topCornerX).toEqual(ONE_HUNDRED);
    expect(service.topCornerY).toEqual(ONE_HUNDRED);
    expect(service.width).toEqual(0);
    expect(service.height).toEqual(0);
    expect(service.updateSelectorShape).toHaveBeenCalledTimes(TWICE);
  });

  it('should reset width and height of selector box', () => {
    service.width = ONE_HUNDRED;
    service.height = ONE_HUNDRED;
    service.resetSize();
    expect(service.width).toEqual(0);
    expect(service.height).toEqual(0);
  });

  it('should reset selection', () => {
    service.width = ONE_HUNDRED;
    service.height = ONE_HUNDRED;
    service.topCornerX = ONE_HUNDRED;
    service.topCornerY = ONE_HUNDRED;
    const drawing = { x: FORTY, y: FORTY, width: FIFTY, height: FIFTY, id: Id.RECTANGLE, points: ''};
    service.selectedObjects.add(drawing);
    service.resetSelectorService();
    expect(service.selectedObjects.size).toEqual(0);
    expect(service.width).toEqual(0);
    expect(service.height).toEqual(0);
    expect(service.topCornerX).toEqual(0);
    expect(service.topCornerY).toEqual(0);
  });

  it('should confirm cursor touches object', () => {
    let object = { x: FIFTY, y: FIFTY, width: FIFTY, height: FIFTY, id: Id.RECTANGLE, points: '' };
    expect(service.cursorTouchesObject(object, FIFTY, FIFTY)).toBeTruthy();
    expect(service.cursorTouchesObject(object, FORTY, FORTY)).toBeFalsy();
    object = { x: 0, y: 0, width: 0, height: 0, id: Id.CRAYON, points: '50,50 50,51 51,50 51,51' };
    expect(service.cursorTouchesObject(object, FIFTY, FIFTY)).toBeTruthy();
    expect(service.cursorTouchesObject(object, FORTY, FORTY)).toBeFalsy();
  });

  it('should confirm selection box intersects object', () => {
    let object = { x: FIFTY, y: FIFTY, width: FORTY, height: FORTY, id: Id.RECTANGLE, points: '' };
    let box = { x: ONE_HUNDRED, y: ONE_HUNDRED, width: FORTY, height: FORTY };
    expect(service.objectInBox(object, box)).toBeFalsy();
    object = { x: 0, y: 0, width: 0, height: 0, id: Id.CRAYON, points: '40,40' };
    expect(service.objectInBox(object, box)).toBeFalsy();
    box = { x: FORTY, y: FORTY, width: ONE_HUNDRED, height: ONE_HUNDRED };
    object = { x: FIFTY, y: FIFTY, width: FORTY, height: FORTY, id: Id.RECTANGLE, points: '' };
    expect(service.objectInBox(object, box)).toBeTruthy();
    object = { x: 0, y: 0, width: 0, height: 0, id: Id.CRAYON, points: '40,40 40,41 41,40 41,41' };
    expect(service.objectInBox(object, box)).toBeTruthy();
  });
});