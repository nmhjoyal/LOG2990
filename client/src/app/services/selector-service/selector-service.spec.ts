// tslint:disable: no-string-literal

import { Id } from 'src/app/drawing-view/components/tools/assets/constants/tool-constants';
import { ITools } from 'src/app/drawing-view/components/tools/assets/interfaces/itools';
import { IPreviewBox } from 'src/app/drawing-view/components/tools/assets/interfaces/shape-interface';
import ClickHelper from 'src/app/helpers/click-helper/click-helper';
import { ISavedDrawing } from '../../../../../common/drawing-information/IDrawing';
import { CanvasInformationService } from '../canvas-information/canvas-information.service';
import { DragService } from '../drag/drag.service';
import { DrawingStorageService } from '../drawing-storage/drawing-storage.service';
import { GridService } from '../grid/grid.service';
import { SaveService } from '../save-service/save.service';
import { UndoRedoService } from '../undo-redo/undo-redo.service';
import { SelectorService } from './selector-service';

describe('SelectorService', () => {
  let service: SelectorService;
  const canvasInformation: CanvasInformationService = new CanvasInformationService();
  const drawingStorage: DrawingStorageService = new DrawingStorageService();
  const undoRedo: UndoRedoService = new UndoRedoService(drawingStorage, canvasInformation);
  const saveService: SaveService = new SaveService(drawingStorage, undoRedo);
  const gridService: GridService = new GridService();
  let dragService: DragService;
  const FIFTY = 50;
  const FORTY = 40;
  const ONE_HUNDRED = 100;

  beforeEach(() => {
    service = new SelectorService(saveService);
    dragService = new DragService(service, gridService);
  });

  it('should be created with correct initialized values', () => {
    expect(service).toBeTruthy();
    expect(service.selectedObjects).toBeDefined();
    expect(service.topCorner.x).toEqual(0);
    expect(service.topCorner.y).toEqual(0);
    expect(service.bottomCorner.x).toEqual(0);
    expect(service.bottomCorner.y).toEqual(0);
  });

  it('should create selector box as drawing', () => {
    let drawing: ISavedDrawing;
    drawing = { x: FIFTY, y: FIFTY, width: FIFTY, height: FIFTY, id: Id.RECTANGLE };
    service.setBoxToDrawing(drawing);
    expect(service.topCorner.x).toEqual(drawing.x);
    expect(service.topCorner.y).toEqual(drawing.y);
    expect(service.MinWidth).toEqual(drawing.width);
    expect(service.MinHeight).toEqual(drawing.height);
    expect(service.bottomCorner.x).toEqual(drawing.x + drawing.width);
    expect(service.bottomCorner.y).toEqual(drawing.y + drawing.height);
    drawing = { x: FIFTY, y: FIFTY, width: FIFTY, height: FIFTY, id: Id.TEXT };
    service.setBoxToDrawing(drawing);
    expect(service.topCorner.y).toEqual(drawing.y);
    expect(service.MinWidth).toEqual(drawing.width);
    expect(service.MinHeight).toEqual(drawing.height);
    expect(service.topCorner.x).toEqual(drawing.x);
    expect(service.bottomCorner.x).toEqual(drawing.x + drawing.width);
    expect(service.bottomCorner.y).toEqual(drawing.y + drawing.height);
    drawing = { x: FIFTY, y: ONE_HUNDRED, width: FORTY, height: FORTY, id: Id.ELLIPSE };
    service.setBoxToDrawing(drawing);
    expect(service.topCorner.x).toEqual(drawing.x - drawing.width);
    expect(service.topCorner.y).toEqual(drawing.y - drawing.height);
    expect(service.MinWidth).toEqual(drawing.width * 2);
    expect(service.MinHeight).toEqual(drawing.height * 2);
    expect(service.bottomCorner.x).toEqual(drawing.x - drawing.width + (drawing.width * 2));
    expect(service.bottomCorner.y).toEqual(drawing.y - drawing.height + (drawing.height * 2));
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
    expect(service.selectedObjects.size).toEqual(2);
    objectInBox.and.returnValue(false);
    service.checkForItems(false, drawings, box);
    expect(service.selectedObjects.size).toEqual(0);
  });

  it('should update corners depending on direction or drag', () => {
    service.updateCorners(FIFTY, FORTY, FORTY, FIFTY, ONE_HUNDRED, ONE_HUNDRED);
    expect(service.topCorner.x).toEqual(FIFTY + ONE_HUNDRED);
    expect(service.topCorner.y).toEqual(FIFTY + ONE_HUNDRED);
    service.updateCorners(FORTY, FIFTY, FIFTY, FORTY, ONE_HUNDRED, ONE_HUNDRED);
    expect(service.topCorner.x).toEqual(FIFTY + ONE_HUNDRED);
    expect(service.topCorner.y).toEqual(FIFTY + ONE_HUNDRED);
  });

  it('should update corners depending on drawing dimensions', () => {
    let drawing: ITools;
    drawing = { x: FIFTY, y: FORTY, width: FIFTY, height: FIFTY, id: Id.RECTANGLE };
    service.topCorner.x = FORTY;
    service.topCorner.y = FIFTY;
    service.bottomCorner.x = FORTY;
    service.bottomCorner.y = ONE_HUNDRED;
    service.updateSelectorShape(drawing);
    expect(service.topCorner.x).toEqual(FORTY);
    expect(service.topCorner.y).toEqual(drawing.y);
    expect(service.bottomCorner.x).toEqual(drawing.x + drawing.width);
    expect(service.bottomCorner.y).toEqual(ONE_HUNDRED);
    drawing = { x: FIFTY, y: FORTY, width: FIFTY, height: FIFTY, id: Id.TEXT };
    service.updateSelectorShape(drawing);
    expect(service.topCorner.x).toEqual(FORTY);
    expect(service.topCorner.y).toEqual(drawing.y);
    expect(service.bottomCorner.x).toEqual(drawing.x + drawing.width);
    expect(service.bottomCorner.y).toEqual(ONE_HUNDRED);
    drawing = { x: FIFTY, y: ONE_HUNDRED, width: FORTY, height: FORTY, id: Id.ELLIPSE };
    service.topCorner.x = FIFTY;
    service.topCorner.y = FORTY;
    service.bottomCorner.x = ONE_HUNDRED;
    service.bottomCorner.y = FORTY;
    service.updateSelectorShape(drawing);
    expect(service.topCorner.x).toEqual(drawing.x - drawing.width);
    expect(service.topCorner.y).toEqual(FORTY);
    expect(service.bottomCorner.x).toEqual(ONE_HUNDRED);
    expect(service.bottomCorner.y).toEqual((drawing.y - drawing.height) + (drawing.height * 2));
  });

  it('should recalculate selector shape with list of selected items', () => {
    let drawing: ITools;
    drawing = { x: FIFTY, y: FORTY, width: FIFTY, height: FIFTY, id: Id.RECTANGLE };
    service.selectedObjects.add(drawing);
    drawing = { x: FORTY, y: FORTY, width: FIFTY, height: FIFTY, id: Id.RECTANGLE };
    service.selectedObjects.add(drawing);
    spyOn(service, 'updateSelectorShape').and.callFake(() => { return; });
    service.recalculateShape(ONE_HUNDRED, ONE_HUNDRED);
    expect(service.topCorner.x).toEqual(ONE_HUNDRED);
    expect(service.topCorner.y).toEqual(ONE_HUNDRED);
    expect(service.bottomCorner.x).toEqual(0);
    expect(service.bottomCorner.y).toEqual(0);
    expect(service.updateSelectorShape).toHaveBeenCalledTimes(2);
  });

  it('should reset width and height of selector box', () => {
    service.bottomCorner.x = ONE_HUNDRED;
    service.bottomCorner.y = ONE_HUNDRED;
    service.resetSize();
    expect(service.bottomCorner.x).toEqual(0);
    expect(service.bottomCorner.y).toEqual(0);
  });

  it('should reset selection', () => {
    service.bottomCorner.x = ONE_HUNDRED;
    service.bottomCorner.y = ONE_HUNDRED;
    service.topCorner.x = ONE_HUNDRED;
    service.topCorner.y = ONE_HUNDRED;
    const drawing = { x: FORTY, y: FORTY, width: FIFTY, height: FIFTY, id: Id.RECTANGLE };
    service.selectedObjects.add(drawing);
    service.resetSelectorService();
    expect(service.selectedObjects.size).toEqual(0);
    expect(service.bottomCorner.x).toEqual(0);
    expect(service.bottomCorner.y).toEqual(0);
    expect(service.topCorner.x).toEqual(0);
    expect(service.topCorner.y).toEqual(0);
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

  it('should modify the align property if the dragged object is of type text', () => {
    const originalAlignX = 10;
    const text: ITools = { x: FIFTY, y: FIFTY, width: FIFTY, height: FIFTY, id: Id.TEXT, alignX: originalAlignX };
    service['selectedObjects'].add(text);
    service['topCorner'].x = 0;
    service['bottomCorner'].x = originalAlignX;
    dragService.dragObjects(FORTY, FORTY, FIFTY, FIFTY);
    expect(text.alignX).toEqual(originalAlignX + FORTY - 0 - (originalAlignX / 2));
  });

  it('should modify the sprays  if the dragged object is of type spray paint', () => {
    const sprayWidth = 10;
    const spray: ITools = { x: FIFTY, y: FIFTY, width: FIFTY, height: FIFTY, id: Id.TEXT, sprays: [] };
    spray.sprays = [{ cx: 1, cy: 1, seed: 1 }];
    service['selectedObjects'].add(spray);
    service['topCorner'].x = 0;
    service['topCorner'].y = 0;
    service['bottomCorner'].x = sprayWidth;
    service['bottomCorner'].y = sprayWidth;
    dragService.dragObjects(FORTY, FORTY, FIFTY, FIFTY);
    expect(spray.sprays[0].cx).toEqual(1 + FORTY - 0 - sprayWidth / 2); // cx (1) + cursorX (40) - topCornerX (0) - MinWidth (5)
    expect(spray.sprays[0].cy).toEqual(1 + FORTY - 0 - sprayWidth / 2);

  });

  it('#SelectedObjects should return the selected objects', () => {
    expect(service.SelectedObjects).toEqual(service['selectedObjects']);
  });
});
