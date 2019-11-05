import { Id } from 'src/app/drawing-view/components/tools/assets/constants/tool-constants';
import { ITools } from 'src/app/drawing-view/components/tools/assets/interfaces/itools';
import { IPreviewBox } from 'src/app/drawing-view/components/tools/assets/interfaces/shape-interface';
import ClickHelper from 'src/app/helpers/click-helper/click-helper';
import { ISavedDrawing } from '../../../../../common/drawing-information/IDrawing';
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
    expect(service.width).toEqual(0);
    expect(service.height).toEqual(0);
  });

  it('should be created with correct initialized values', () => {
    expect(service).toBeTruthy();
    expect(service.selectedObjects).toBeDefined();
    expect(service.SelectedObjects).toEqual(service.selectedObjects);
    expect(service.topCornerX).toEqual(0);
    expect(service.topCornerY).toEqual(0);
    expect(service.width).toEqual(0);
    expect(service.height).toEqual(0);
  });

  it('should create selector box as drawing', () => {
    let drawing: ISavedDrawing;
    drawing = { x: FIFTY, y: FIFTY, width: FIFTY, height: FIFTY, id: Id.RECTANGLE };
    service.setBoxToDrawing(drawing);
    expect(service.topCornerX).toEqual(drawing.x);
    expect(service.topCornerY).toEqual(drawing.y);
    expect(service.MinWidth).toEqual(drawing.width);
    expect(service.MinHeight).toEqual(drawing.height);
    expect(service.width).toEqual(drawing.x + drawing.width);
    expect(service.height).toEqual(drawing.y + drawing.height);
    drawing = { boxXPosition: FIFTY, x: FORTY, y: FIFTY, width: FIFTY, height: FIFTY, id: Id.TEXT };
    service.setBoxToDrawing(drawing);
    expect(service.topCornerY).toEqual(drawing.y);
    expect(service.MinWidth).toEqual(drawing.width);
    expect(service.MinHeight).toEqual(drawing.height);
    if (drawing.boxXPosition !== undefined) {
      expect(service.topCornerX).toEqual(drawing.boxXPosition);
      expect(service.width).toEqual(drawing.boxXPosition + drawing.width);
    }
    expect(service.height).toEqual(drawing.y + drawing.height);
    drawing = { x: FIFTY, y: ONE_HUNDRED, width: FORTY, height: FORTY, id: Id.ELLIPSE };
    service.setBoxToDrawing(drawing);
    expect(service.topCornerX).toEqual(drawing.x - drawing.width);
    expect(service.topCornerY).toEqual(drawing.y - drawing.height);
    expect(service.MinWidth).toEqual(drawing.width * TWICE);
    expect(service.MinHeight).toEqual(drawing.height * TWICE);
    expect(service.width).toEqual(drawing.x - drawing.width + (drawing.width * TWICE));
    expect(service.height).toEqual(drawing.y - drawing.height + (drawing.height * TWICE));
  });

  it('should check for items, add when not in reverse and delete if in reverse', () => {
    spyOn(service, 'updateSelectorShape').and.callFake(() => { return; });
    const objectInBox = spyOn(service, 'objectInBox');
    objectInBox.and.returnValue(true);
    const drawing1 = { x: FIFTY, y: FORTY, width: FIFTY, height: FIFTY, id: Id.RECTANGLE };
    const drawing2 = { x: FORTY, y: FORTY, width: FIFTY, height: FIFTY, id: Id.RECTANGLE };
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
    objectInBox.and.returnValue(false);
    service.checkForItems(false, drawings, box);
    expect(service.selectedObjects.size).toEqual(0);
  });

  it('should update corners depending on direction or drag', () => {
    service.updateCorners(FIFTY, FORTY, FORTY, FIFTY, ONE_HUNDRED, ONE_HUNDRED);
    expect(service.topCornerX).toEqual(FIFTY + ONE_HUNDRED);
    expect(service.topCornerY).toEqual(FIFTY + ONE_HUNDRED);
    service.updateCorners(FORTY, FIFTY, FIFTY, FORTY, ONE_HUNDRED, ONE_HUNDRED);
    expect(service.topCornerX).toEqual(FIFTY + ONE_HUNDRED);
    expect(service.topCornerY).toEqual(FIFTY + ONE_HUNDRED);
  });

  it('should update corners depending on drawing dimensions', () => {
    let drawing: ITools;
    drawing = { x: FIFTY, y: FORTY, width: FIFTY, height: FIFTY, id: Id.RECTANGLE };
    service.topCornerX = FORTY;
    service.topCornerY = FIFTY;
    service.width = FORTY;
    service.height = ONE_HUNDRED;
    service.updateSelectorShape(drawing);
    expect(service.topCornerX).toEqual(FORTY);
    expect(service.topCornerY).toEqual(drawing.y);
    expect(service.width).toEqual(drawing.x + drawing.width);
    expect(service.height).toEqual(ONE_HUNDRED);
    drawing = { boxXPosition: FIFTY, x: FORTY, y: FORTY, width: FIFTY, height: FIFTY, id: Id.TEXT };
    service.updateSelectorShape(drawing);
    expect(service.topCornerX).toEqual(FORTY);
    expect(service.topCornerY).toEqual(drawing.y);
    if (drawing.boxXPosition !== undefined) {
      expect(service.width).toEqual(drawing.boxXPosition + drawing.width);
    }
    expect(service.height).toEqual(ONE_HUNDRED);
    drawing = { x: FIFTY, y: ONE_HUNDRED, width: FORTY, height: FORTY, id: Id.ELLIPSE };
    service.topCornerX = FIFTY;
    service.topCornerY = FORTY;
    service.width = ONE_HUNDRED;
    service.height = FORTY;
    service.updateSelectorShape(drawing);
    expect(service.topCornerX).toEqual(drawing.x - drawing.width);
    expect(service.topCornerY).toEqual(FORTY);
    expect(service.width).toEqual(ONE_HUNDRED);
    expect(service.height).toEqual((drawing.y - drawing.height) + (drawing.height * TWICE));
  });

  it('should recalculate selector shape with list of selected items', () => {
    let drawing: ITools;
    drawing = { x: FIFTY, y: FORTY, width: FIFTY, height: FIFTY, id: Id.RECTANGLE };
    service.selectedObjects.add(drawing);
    drawing = { x: FORTY, y: FORTY, width: FIFTY, height: FIFTY, id: Id.RECTANGLE };
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
    const drawing = { x: FORTY, y: FORTY, width: FIFTY, height: FIFTY, id: Id.RECTANGLE };
    service.selectedObjects.add(drawing);
    service.resetSelectorService();
    expect(service.selectedObjects.size).toEqual(0);
    expect(service.width).toEqual(0);
    expect(service.height).toEqual(0);
    expect(service.topCornerX).toEqual(0);
    expect(service.topCornerY).toEqual(0);
  });

  it('should return true if cursor click inside object or on border', () => {
    const drawing: ITools = { x: FIFTY, y: FIFTY, width: FIFTY, height: FIFTY, id: Id.RECTANGLE };
    const cursorOnBorder = spyOn(ClickHelper, 'cursorTouchesObjectBorder');
    const cursorInObject = spyOn(ClickHelper, 'cursorInsideObject');
    cursorOnBorder.and.returnValue(true);
    cursorInObject.and.returnValue(true);
    expect(service.cursorTouchesObject(drawing, FIFTY, FIFTY)).toBeTruthy();
    cursorOnBorder.and.returnValue(false);
    cursorInObject.and.returnValue(true);
    expect(service.cursorTouchesObject(drawing, FIFTY, FIFTY)).toBeTruthy();
    cursorOnBorder.and.returnValue(true);
    cursorInObject.and.returnValue(false);
    expect(service.cursorTouchesObject(drawing, FIFTY, FIFTY)).toBeTruthy();
    cursorOnBorder.and.returnValue(false);
    cursorInObject.and.returnValue(false);
    expect(service.cursorTouchesObject(drawing, FIFTY, FIFTY)).toBeFalsy();
  });

  it('should return true if object shares area with selector', () => {
    const drawing: ITools = { x: FIFTY, y: FIFTY, width: FIFTY, height: FIFTY, id: Id.RECTANGLE };
    const previewBox: IPreviewBox = { x: FIFTY, y: FIFTY, width: FIFTY, height: FIFTY };
    const objectSharesBox = spyOn(ClickHelper, 'objectSharesBoxArea');
    objectSharesBox.and.returnValue(true);
    expect(service.objectInBox(drawing, previewBox)).toBeTruthy();
    objectSharesBox.and.returnValue(false);
    expect(service.objectInBox(drawing, previewBox)).toBeFalsy();
  });
});
