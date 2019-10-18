import { IShape } from 'src/app/drawing-view/components/tools/assets/interfaces/shape-interface';
import { Id } from 'src/app/drawing-view/components/tools/assets/tool-constants';
import { SelectorService } from './selector-service';

describe('SelectorService', () => {
  let service: SelectorService;
  const toolServiceMock = jasmine.createSpyObj('ToolHandlerService', ['']);
  const FIFTY = 50;
  const FORTY = 40;
  const ONE_HUNDRED = 100;
  const TWICE = 2;

  beforeEach(() => {
    service = new SelectorService(toolServiceMock);
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
    let drawing: IShape;
    drawing = { x: FIFTY, y: FIFTY, width: FIFTY, height: FIFTY, fillOpacity: 0, id: Id.RECTANGLE, primaryColor: 'black',
                secondaryColor: 'black', strokeOpacity: 0, strokeWidth: 1};
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
    const drawing1 = { x: FIFTY, y: FORTY, width: FIFTY, height: FIFTY, fillOpacity: 0, id: Id.RECTANGLE, primaryColor: 'black',
                secondaryColor: 'black', strokeOpacity: 0, strokeWidth: 1};
    const drawing2 = { x: FORTY, y: FORTY, width: FIFTY, height: FIFTY, fillOpacity: 0, id: Id.RECTANGLE, primaryColor: 'black',
                secondaryColor: 'black', strokeOpacity: 0, strokeWidth: 1};
    service.toolService.drawings = [];
    service.toolService.drawings.push(drawing1);
    service.toolService.drawings.push(drawing2);
    service.selectedObjects.add(drawing1);
    service.selectedObjects.add(drawing2);
    service.checkForItems(true, FIFTY, FIFTY);
    expect(service.selectedObjects.size).toEqual(0);
    service.checkForItems(false, FIFTY, FIFTY);
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
    let drawing: IShape;
    drawing = { x: FIFTY, y: FORTY, width: FIFTY, height: FIFTY, fillOpacity: 0, id: Id.RECTANGLE, primaryColor: 'black',
                secondaryColor: 'black', strokeOpacity: 0, strokeWidth: 1};
    service.topCornerX = FORTY;
    service.topCornerY = FIFTY;
    service.width = FORTY;
    service.height = ONE_HUNDRED;
    service.updateSelectorShape(drawing);
    expect(service.topCornerX).toEqual(FORTY);
    expect(service.topCornerY).toEqual(drawing.y);
    expect(service.width).toEqual(drawing.x + drawing.width);
    expect(service.height).toEqual(ONE_HUNDRED);
    drawing = { x: FORTY, y: FIFTY, width: FIFTY, height: FIFTY, fillOpacity: 0, id: Id.RECTANGLE, primaryColor: 'black',
                secondaryColor: 'black', strokeOpacity: 0, strokeWidth: 1};
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
    let drawing: IShape;
    drawing = { x: FIFTY, y: FORTY, width: FIFTY, height: FIFTY, fillOpacity: 0, id: Id.RECTANGLE, primaryColor: 'black',
                secondaryColor: 'black', strokeOpacity: 0, strokeWidth: 1};
    service.selectedObjects.add(drawing);
    drawing = { x: FORTY, y: FORTY, width: FIFTY, height: FIFTY, fillOpacity: 0, id: Id.RECTANGLE, primaryColor: 'black',
                secondaryColor: 'black', strokeOpacity: 0, strokeWidth: 1};
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
    const drawing = { x: FORTY, y: FORTY, width: FIFTY, height: FIFTY, fillOpacity: 0, id: Id.RECTANGLE, primaryColor: 'black',
    secondaryColor: 'black', strokeOpacity: 0, strokeWidth: 1};
    service.selectedObjects.add(drawing);
    service.toolService.selection = { x: FORTY, y: FORTY, width: FIFTY, height: FIFTY,
      fillOpacity: 0, id: Id.RECTANGLE, primaryColor: 'black', secondaryColor: 'black', strokeOpacity: 0, strokeWidth: 1};
    service.resetSelection();
    expect(service.selectedObjects.size).toEqual(0);
    expect(service.width).toEqual(0);
    expect(service.height).toEqual(0);
    expect(service.topCornerX).toEqual(0);
    expect(service.topCornerY).toEqual(0);
  });

  it('should confirm selection exists already', () => {
    service.toolService.selection = { x: FORTY, y: FORTY, width: FIFTY, height: FIFTY,
      fillOpacity: 0, id: Id.RECTANGLE, primaryColor: 'black', secondaryColor: 'black', strokeOpacity: 0, strokeWidth: 1};
    expect(service.selectionExists()).toBeTruthy();
    service.toolService.selection = { x: FORTY, y: FORTY, width: 0, height: 0,
      fillOpacity: 0, id: Id.RECTANGLE, primaryColor: 'black', secondaryColor: 'black', strokeOpacity: 0, strokeWidth: 1};
    expect(service.selectionExists()).toBeFalsy();
  });

  it('should confirm cursor touches object', () => {
    const object = { x: FIFTY, y: FIFTY, width: FIFTY, height: FIFTY, fillOpacity: 0, id: Id.RECTANGLE, primaryColor: 'black',
    secondaryColor: 'black', strokeOpacity: 0, strokeWidth: 1};
    expect(service.cursorTouchesObject(object, FIFTY, FIFTY)).toBeTruthy();
    expect(service.cursorTouchesObject(object, FORTY, FORTY)).toBeFalsy();
  });

  it('should confirm selection box intersects object', () => {
    let object = { x: FIFTY, y: FIFTY, width: FORTY, height: FORTY, fillOpacity: 0, id: Id.RECTANGLE, primaryColor: 'black',
      secondaryColor: 'black', strokeOpacity: 0, strokeWidth: 1};
    service.bottomCornerX = FORTY;
    service.bottomCornerY = FORTY;
    expect(service.objectInBox(object, ONE_HUNDRED, ONE_HUNDRED)).toBeFalsy();
    expect(service.objectInBox(object, ONE_HUNDRED, FORTY)).toBeFalsy();
    expect(service.objectInBox(object, FORTY, ONE_HUNDRED)).toBeFalsy();
    expect(service.objectInBox(object, FORTY, FORTY)).toBeFalsy();
    object = { x: ONE_HUNDRED, y: ONE_HUNDRED, width: ONE_HUNDRED, height: ONE_HUNDRED, fillOpacity: 0, id: Id.RECTANGLE,
      primaryColor: 'black', secondaryColor: 'black', strokeOpacity: 0, strokeWidth: 1};
    service.bottomCornerX = ONE_HUNDRED;
    service.bottomCornerY = ONE_HUNDRED;
    expect(service.objectInBox(object, ONE_HUNDRED, ONE_HUNDRED)).toBeTruthy();
    expect(service.objectInBox(object, ONE_HUNDRED, FORTY)).toBeTruthy();
    expect(service.objectInBox(object, FORTY, ONE_HUNDRED)).toBeTruthy();
    expect(service.objectInBox(object, FORTY, FORTY)).toBeTruthy();
  });
});