import { ITools } from 'src/app/drawing-view/components/tools/assets/interfaces/itools';
import { IPreviewBox } from 'src/app/drawing-view/components/tools/assets/interfaces/shape-interface';
import { Id } from 'src/app/drawing-view/components/tools/assets/tool-constants';
import ClickHelper from 'src/app/helpers/click-helper/click-helper';
import { NumericalValues } from 'src/AppConstants/NumericalValues';
import { ColorService } from '../color_service/color.service';
import { ToolHandlerService } from '../tool-handler/tool-handler.service';
import { SelectorService } from './selector-service';

describe('SelectorService', () => {
  let service: SelectorService;
  let toolService: ToolHandlerService;
  let colorService: ColorService;
  const FIFTY = 50;
  const FORTY = 40;
  const FOUR = 4;
  const THREE = 3;
  const ONE_HUNDRED = 100;
  const TWICE = 2;

  beforeEach(() => {
    colorService = new ColorService();
    toolService = new ToolHandlerService(colorService);
    service = new SelectorService(toolService);
  });

  it('should be created with correct initialized values', () => {
    expect(service).toBeTruthy();
    expect(service.selectedObjects).toBeDefined();
    expect(service.clipboard).toBeDefined();
    expect(service.topCornerX).toEqual(0);
    expect(service.topCornerY).toEqual(0);
    expect(service.furthestX).toEqual(0);
    expect(service.furthestY).toEqual(0);
    expect(service.lastCursorX).toEqual(0);
    expect(service.lastCursorY).toEqual(0);
    expect(service.pasteOffset).toEqual(0);
  });

  it('should add items to clipboard on copy', () => {
    let drawing: ITools;
    drawing = { x: FIFTY, y: FIFTY, width: FIFTY, height: FIFTY, id: Id.RECTANGLE };
    service.selectedObjects.add(drawing);
    service.copy();
    expect(service.clipboard).not.toBeNull();
  });

  it('should add items to clipboard on cut', () => {
    let drawing: ITools;
    drawing = { x: FIFTY, y: FIFTY, width: FIFTY, height: FIFTY, id: Id.RECTANGLE };
    service.selectedObjects.add(drawing);
    service.cut();
    expect(service.clipboard.size).toEqual(1);
  });

  it('should remove an item from drawing on delete', () => {
    let drawing: ITools;
    drawing = { x: FIFTY, y: FIFTY, width: FIFTY, height: FIFTY, id: Id.RECTANGLE };
    service.selectedObjects.add(drawing);
    toolService.drawings.push(drawing);
    service.delete();
    expect(toolService.drawings.length).toEqual(0);
  });

  it('should remove an item from drawing on cut', () => {
    let drawing: ITools;
    drawing = { x: FIFTY, y: FIFTY, width: FIFTY, height: FIFTY, id: Id.RECTANGLE };
    service.selectedObjects.add(drawing);
    toolService.drawings.push(drawing);
    service.delete();
    expect(toolService.drawings.length).toEqual(0);
  });

  it('should add drawing to canvas on paste', () => {
    const drawing1 = { x: FIFTY, y: FORTY, width: FIFTY, height: FIFTY, id: Id.RECTANGLE };
    const drawing2 = { x: FORTY, y: FORTY, width: FIFTY, height: FIFTY, id: Id.RECTANGLE };
    toolService.drawings.push(drawing1);
    toolService.drawings.push(drawing2);
    service.selectedObjects.add(drawing1);
    service.selectedObjects.add(drawing2);
    service.duplicate(); // paste?
    expect(toolService.drawings.length).toEqual(FOUR);
    expect(toolService.drawings[toolService.drawings.length - 1].x).not.toEqual(FORTY);
    expect(toolService.drawings[toolService.drawings.length - 1].y).not.toEqual(FORTY);
  });

  it('should add drawing with offset on paste', () => {
    const drawing = { x: FIFTY, y: FORTY, width: FIFTY, height: FIFTY, id: Id.RECTANGLE };
    toolService.drawings.push(drawing);
    service.selectedObjects.add(drawing);
    service.lastCursorX = FIFTY;
    service.lastCursorY = FORTY;
    service.duplicate();
    expect(toolService.drawings.length).toEqual(2);
    expect(toolService.drawings[toolService.drawings.length - 1].x).toEqual(FIFTY + NumericalValues.DUPLICATE_OFFSET );
    expect(toolService.drawings[toolService.drawings.length - 1].y).toEqual(FORTY + NumericalValues.DUPLICATE_OFFSET );
  });

  it('should change offset multiple duplicates', () => {
    const drawing = { x: FIFTY, y: FORTY, width: FIFTY, height: FIFTY, id: Id.RECTANGLE };
    toolService.drawings.push(drawing);
    service.selectedObjects.add(drawing);
    service.duplicate();
    service.duplicate();
    service.duplicate();
    expect(service.pasteOffset).toEqual(NumericalValues.DUPLICATE_OFFSET * 2);
    expect(toolService.drawings[toolService.drawings.length - 1].x).toEqual(FIFTY + NumericalValues.DUPLICATE_OFFSET * THREE);
    expect(toolService.drawings[toolService.drawings.length - 1].y).toEqual(FORTY + NumericalValues.DUPLICATE_OFFSET * THREE);
  });

  it('should add line drawing to canvas on duplicate', () => {
    const parsedPoints = spyOn(service, 'parsePolylinePoints');
    const drawing1: ITools = { x: FIFTY, y: FORTY, width: FIFTY, height: FIFTY, points: '0,100 50,25', id: Id.LINE };
    const drawing2: ITools = { x: FORTY, y: FORTY, width: FIFTY, height: FIFTY, vertices: '0,0 1,1 0,0', id: Id.ELLIPSE };
    toolService.drawings.push(drawing1);
    toolService.drawings.push(drawing2);
    service.selectedObjects.add(drawing1);
    service.selectedObjects.add(drawing2);
    service.duplicate();
    expect(parsedPoints).toHaveBeenCalled();
    expect(toolService.drawings.length).toEqual(FOUR);
    expect(toolService.drawings[toolService.drawings.length - 1].x).not.toEqual(FORTY);
    expect(toolService.drawings[toolService.drawings.length - 1].y).not.toEqual(FORTY);
  });

  it('should change points of drawing on parsePolylinePoints', () => {
    const drawing1: ITools = { x: FIFTY, y: FORTY, width: FIFTY, height: FIFTY, points: '0,100 50,20', id: Id.LINE };
    const drawing2: ITools = { x: FORTY, y: FORTY, width: FIFTY, height: FIFTY, vertices: '0,0 1,1 0,0', id: Id.POLYGON };

    service.parsePolylinePoints(FIFTY, FIFTY, drawing1);
    expect(drawing1.points).not.toEqual('0,100 50,20');
    service.parsePolylinePoints(FIFTY, FIFTY, drawing2);
    expect(drawing2.vertices).not.toEqual('0,0 1,1 0,0');
  });

  it('should return drawing to initial value if outside of screen', () => {
    const drawing = { x: window.innerWidth, y: window.innerHeight, width: FIFTY, height: FIFTY, id: Id.RECTANGLE };
    toolService.drawings.push(drawing);
    service.selectedObjects.add(drawing);
    service.duplicate();
    expect(service.pasteOffset).toEqual(NumericalValues.DUPLICATE_OFFSET / 2);
    expect(toolService.drawings[toolService.drawings.length - 1].x).not.toEqual(window.innerWidth);
    expect(toolService.drawings[toolService.drawings.length - 1].y).not.toEqual(window.innerHeight);
  });

  it('should do nothing if no selected objects', () => {
    const drawing: ITools = { x: FIFTY, y: FORTY, width: FIFTY, height: FIFTY, id: Id.RECTANGLE };
    toolService.drawings.push(drawing);
    service.copy();
    expect(service.clipboard.size).toEqual(0);
    service.paste(FIFTY, FIFTY);
    expect(toolService.drawings.length).toEqual(1);
    service.cut();
    expect(toolService.drawings.length).toEqual(1);
  });

  it('should add drawing to canvas on duplicate', () => {
    const drawing1 = { x: FIFTY, y: FORTY, width: FIFTY, height: FIFTY, id: Id.RECTANGLE };
    const drawing2 = { x: FORTY, y: FORTY, width: FIFTY, height: FIFTY, id: Id.RECTANGLE };
    toolService.drawings.push(drawing1);
    toolService.drawings.push(drawing2);
    service.selectedObjects.add(drawing1);
    service.selectedObjects.add(drawing2);
    service.duplicate();
    expect(toolService.drawings.length).toEqual(FOUR);
    expect(toolService.drawings[toolService.drawings.length - 1].x).not.toEqual(FORTY);
    expect(toolService.drawings[toolService.drawings.length - 1].y).not.toEqual(FORTY);
  });

  it('should create selector box as drawing', () => {
    let drawing: ITools;
    drawing = { x: FIFTY, y: FIFTY, width: FIFTY, height: FIFTY, id: Id.RECTANGLE };
    service.setBoxToDrawing(drawing);
    expect(service.topCornerX).toEqual(drawing.x);
    expect(service.topCornerY).toEqual(drawing.y);
    expect(service.MinWidth).toEqual(drawing.width);
    expect(service.MinHeight).toEqual(drawing.height);
    expect(service.furthestX).toEqual(drawing.x + drawing.width);
    expect(service.furthestY).toEqual(drawing.y + drawing.height);
    drawing = { x: FIFTY, y: ONE_HUNDRED, width: FORTY, height: FORTY, id: Id.ELLIPSE };
    service.setBoxToDrawing(drawing);
    expect(service.topCornerX).toEqual(drawing.x - drawing.width);
    expect(service.topCornerY).toEqual(drawing.y - drawing.height);
    expect(service.MinWidth).toEqual(drawing.width * TWICE);
    expect(service.MinHeight).toEqual(drawing.height * TWICE);
    expect(service.furthestX).toEqual(drawing.x - drawing.width + (drawing.width * TWICE));
    expect(service.furthestY).toEqual(drawing.y - drawing.height + (drawing.height * TWICE));
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
    service.furthestX = FORTY;
    service.furthestY = ONE_HUNDRED;
    service.updateSelectorShape(drawing);
    expect(service.topCornerX).toEqual(FORTY);
    expect(service.topCornerY).toEqual(drawing.y);
    expect(service.furthestX).toEqual(drawing.x + drawing.width);
    expect(service.furthestY).toEqual(ONE_HUNDRED);
    drawing = { x: FIFTY, y: ONE_HUNDRED, width: FORTY, height: FORTY, id: Id.ELLIPSE };
    service.topCornerX = FIFTY;
    service.topCornerY = FORTY;
    service.furthestX = ONE_HUNDRED;
    service.furthestY = FORTY;
    service.updateSelectorShape(drawing);
    expect(service.topCornerX).toEqual(drawing.x - drawing.width);
    expect(service.topCornerY).toEqual(FORTY);
    expect(service.furthestX).toEqual(ONE_HUNDRED);
    expect(service.furthestY).toEqual((drawing.y - drawing.height) + (drawing.height * TWICE));
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
    expect(service.furthestX).toEqual(0);
    expect(service.furthestY).toEqual(0);
    expect(service.updateSelectorShape).toHaveBeenCalledTimes(TWICE);
  });

  it('should reset width and height of selector box', () => {
    service.furthestX = ONE_HUNDRED;
    service.furthestY = ONE_HUNDRED;
    service.resetSize();
    expect(service.furthestX).toEqual(0);
    expect(service.furthestY).toEqual(0);
  });

  it('should reset selection', () => {
    service.furthestX = ONE_HUNDRED;
    service.furthestY = ONE_HUNDRED;
    service.topCornerX = ONE_HUNDRED;
    service.topCornerY = ONE_HUNDRED;
    const drawing = { x: FORTY, y: FORTY, width: FIFTY, height: FIFTY, id: Id.RECTANGLE };
    service.selectedObjects.add(drawing);
    service.resetSelectorService();
    expect(service.selectedObjects.size).toEqual(0);
    expect(service.furthestX).toEqual(0);
    expect(service.furthestY).toEqual(0);
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
