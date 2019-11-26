// tslint:disable: no-string-literal

import { Id } from 'src/app/drawing-view/components/tools/assets/constants/tool-constants';
import { ITools } from 'src/app/drawing-view/components/tools/assets/interfaces/itools';
import { NumericalValues } from 'src/AppConstants/NumericalValues';
import { DrawingStorageService } from '../drawing-storage/drawing-storage.service';
import { SaveService } from '../save-service/save.service';
import { SelectorService } from '../selector-service/selector-service';
import { UndoRedoService } from '../undo-redo/undo-redo.service';
import { ClipboardService } from './clipboard-service';

describe('ClipboardService', () => {
  let service: ClipboardService;
  let selectorService: SelectorService;
  let drawingStorage: DrawingStorageService;
  let undoRedoService: UndoRedoService;
  let parserService: ParserService;
  let saveService: SaveService;
  let dummyOperation: ITools;
  const FIFTY = 50;
  const FORTY = 40;
  const FOUR = 4;
  const THREE = 3;

  beforeEach(() => {
    drawingStorage = new DrawingStorageService();
    undoRedoService = new UndoRedoService(drawingStorage);
    saveService = new SaveService(drawingStorage, undoRedoService);
    parserService = new ParserService();
    selectorService = new SelectorService(saveService, parserService);

    service = new ClipboardService(drawingStorage, selectorService, undoRedoService, saveService);

    dummyOperation = {
      id: 'dummy',
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      pasteOffset: undefined,
    };
  });

  it('should be created with correct initialized values', () => {
    expect(service).toBeTruthy();
    expect(service['clipboard']).toBeDefined();
    expect(service['lastCursorX']).toEqual(0);
    expect(service['lastCursorY']).toEqual(0);
    expect(service['pasteOffset']).toEqual(0);
  });

  it('should add items to clipboard on copy', () => {
    let drawing: ITools;
    drawing = { x: FIFTY, y: FIFTY, width: FIFTY, height: FIFTY, id: Id.RECTANGLE };
    selectorService.selectedObjects.add(drawing);
    service.copy();
    expect(service['clipboard']).not.toBeNull();
  });

  it('should add items to clipboard on cut', () => {
    let drawing: ITools;
    drawing = { x: FIFTY, y: FIFTY, width: FIFTY, height: FIFTY, id: Id.RECTANGLE };
    selectorService.selectedObjects.add(drawing);
    service.cut();
    expect(service['clipboard'].size).toEqual(1);
  });

  it('should remove an item from drawing on delete', () => {
    let drawing: ITools;
    drawing = { x: FIFTY, y: FIFTY, width: FIFTY, height: FIFTY, id: Id.RECTANGLE };
    selectorService.selectedObjects.add(drawing);
    drawingStorage.drawings.push(drawing);
    service.delete();
    expect(drawingStorage.drawings.length).toEqual(0);
  });

  it('should remove an item from drawing on cut', () => {
    let drawing: ITools;
    drawing = { x: FIFTY, y: FIFTY, width: FIFTY, height: FIFTY, id: Id.RECTANGLE };
    selectorService.selectedObjects.add(drawing);
    drawingStorage.drawings.push(drawing);
    service.delete();
    expect(drawingStorage.drawings.length).toEqual(0);
  });

  it('should add drawing to canvas on paste', () => {
    const drawing1 = { x: FIFTY, y: FORTY, width: FIFTY, height: FIFTY, id: Id.RECTANGLE };
    const drawing2 = { alignX: FORTY, x: FORTY, y: FORTY, width: FIFTY, height: FIFTY, id: Id.TEXT };
    drawingStorage.drawings.push(drawing1);
    drawingStorage.drawings.push(drawing2);
    selectorService.selectedObjects.add(drawing1);
    selectorService.selectedObjects.add(drawing2);
    service.duplicate(); // paste?
    expect(drawingStorage.drawings.length).toEqual(FOUR);
    expect(drawingStorage.drawings[drawingStorage.drawings.length - 1].x).not.toEqual(FORTY);
    expect(drawingStorage.drawings[drawingStorage.drawings.length - 1].y).not.toEqual(FORTY);
  });

  it('should add drawing with offset on paste', () => {
    const drawing = { x: FIFTY, y: FORTY, width: FIFTY, height: FIFTY, id: Id.RECTANGLE };
    drawingStorage.drawings.push(drawing);
    selectorService.selectedObjects.add(drawing);
    service['lastCursorX'] = FIFTY;
    service['lastCursorY'] = FORTY;
    service.duplicate();
    expect(drawingStorage.drawings.length).toEqual(2);
    expect(drawingStorage.drawings[drawingStorage.drawings.length - 1].x).toEqual(FIFTY + NumericalValues.DUPLICATE_OFFSET);
    expect(drawingStorage.drawings[drawingStorage.drawings.length - 1].y).toEqual(FORTY + NumericalValues.DUPLICATE_OFFSET);
  });

  it('should change offset multiple duplicates', () => {
    const drawing = { x: FIFTY, y: FORTY, width: FIFTY, height: FIFTY, id: Id.RECTANGLE };
    drawingStorage.drawings.push(drawing);
    selectorService.selectedObjects.add(drawing);
    service.duplicate();
    service.duplicate();
    service.duplicate();
    expect(service['pasteOffset']).toEqual(NumericalValues.DUPLICATE_OFFSET * 2);
    expect(drawingStorage.drawings[drawingStorage.drawings.length - 1].x).toEqual(FIFTY + NumericalValues.DUPLICATE_OFFSET * THREE);
    expect(drawingStorage.drawings[drawingStorage.drawings.length - 1].y).toEqual(FORTY + NumericalValues.DUPLICATE_OFFSET * THREE);
  });

  it('should add line drawing to canvas on duplicate', () => {
    const parsedPoints = spyOn(service, 'parsePolylinePoints');
    const drawing1: ITools = { x: FIFTY, y: FORTY, width: FIFTY, height: FIFTY, points: '0,100 50,25', id: Id.LINE };
    const drawing2: ITools = { x: FORTY, y: FORTY, width: FIFTY, height: FIFTY, vertices: '0,0 1,1 0,0', id: Id.ELLIPSE };
    drawingStorage.drawings.push(drawing1);
    drawingStorage.drawings.push(drawing2);
    selectorService.selectedObjects.add(drawing1);
    selectorService.selectedObjects.add(drawing2);
    service.duplicate();
    expect(parsedPoints).toHaveBeenCalled();
    expect(drawingStorage.drawings.length).toEqual(FOUR);
    expect(drawingStorage.drawings[drawingStorage.drawings.length - 1].x).not.toEqual(FORTY);
    expect(drawingStorage.drawings[drawingStorage.drawings.length - 1].y).not.toEqual(FORTY);
  });

  it('should change points of drawing on parsePolylinePoints', () => {
    const drawing1: ITools = { x: FIFTY, y: FORTY, width: FIFTY, height: FIFTY, points: '0,100 50,20', id: Id.LINE };
    const drawing2: ITools = { x: FORTY, y: FORTY, width: FIFTY, height: FIFTY, vertices: '0,0 1,1 0,0', id: Id.POLYGON };
    const drawing3: ITools = {
      x: FORTY, y: FORTY, width: FIFTY, height: FIFTY, paths: [{ path: 'M1 4L5 6', pathWidth: 2 },
      { path: 'M7 8L9 10', pathWidth: 2 }], id: Id.PEN,
    };

    service.parsePolylinePoints(FIFTY, FIFTY, drawing1);
    expect(drawing1.points).not.toEqual('0,100 50,20');
    service.parsePolylinePoints(FIFTY, FIFTY, drawing2);
    expect(drawing2.vertices).not.toEqual('0,0 1,1 0,0');
    service.parsePolylinePoints(FIFTY, FIFTY, drawing3);
    expect(drawing2.paths).not.toEqual([{ path: 'M1 4L5 6', pathWidth: 2 }, { path: 'M7 8L9 10', pathWidth: 2 }]);
  });

  it('should return drawing to initial value if outside of screen', () => {
    const drawing = { alignX: window.innerWidth, x: window.innerWidth, y: window.innerHeight, width: FIFTY, height: FIFTY, id: Id.TEXT };
    const drawing2 = { x: window.innerWidth, y: window.innerHeight, width: FIFTY, height: FIFTY, id: Id.RECTANGLE };
    drawingStorage.drawings.push(drawing);
    drawingStorage.drawings.push(drawing2);
    selectorService.selectedObjects.add(drawing);
    selectorService.selectedObjects.add(drawing2);
    service.duplicate();
    expect(service['pasteOffset']).toEqual(NumericalValues.DUPLICATE_OFFSET / 2);
    expect(drawingStorage.drawings[drawingStorage.drawings.length - 1].x).not.toEqual(window.innerWidth);
    expect(drawingStorage.drawings[drawingStorage.drawings.length - 1].y).not.toEqual(window.innerHeight);
  });

  it('should do nothing if no selected objects', () => {
    const drawing: ITools = { x: FIFTY, y: FORTY, width: FIFTY, height: FIFTY, id: Id.RECTANGLE };
    drawingStorage.drawings.push(drawing);
    service.copy();
    expect(service['clipboard'].size).toEqual(0);
    service.paste(FIFTY, FIFTY);
    expect(drawingStorage.drawings.length).toEqual(1);
    service.cut();
    expect(drawingStorage.drawings.length).toEqual(1);
  });

  it('should add drawing to canvas on duplicate', () => {
    const drawing1 = { x: FIFTY, y: FORTY, width: FIFTY, height: FIFTY, id: Id.RECTANGLE };
    const drawing2 = { x: FORTY, y: FORTY, width: FIFTY, height: FIFTY, id: Id.RECTANGLE };
    drawingStorage.drawings.push(drawing1);
    drawingStorage.drawings.push(drawing2);
    selectorService.selectedObjects.add(drawing1);
    selectorService.selectedObjects.add(drawing2);
    service.duplicate();
    expect(drawingStorage.drawings.length).toEqual(FOUR);
    expect(drawingStorage.drawings[drawingStorage.drawings.length - 1].x).not.toEqual(FORTY);
    expect(drawingStorage.drawings[drawingStorage.drawings.length - 1].y).not.toEqual(FORTY);
  });

  it('#redo should redefine pasteoffset only if the redid operation is defined and it has a defined pasteOffset', () => {
    const redoSpy = spyOn(service.undoRedoService, 'redo');
    redoSpy.and.returnValue(undefined);
    service['pasteOffset'] = FORTY;

    service.redo();
    expect(redoSpy.calls.count()).toBe(1);
    expect(service['pasteOffset']).toBe(FORTY);

    redoSpy.and.returnValue(dummyOperation);

    service.redo();
    expect(redoSpy.calls.count()).toBe(2);
    expect(service['pasteOffset']).toBe(FORTY);

    dummyOperation['pasteOffset'] = 0;
    redoSpy.and.returnValue(dummyOperation);

    service.redo();
    expect(redoSpy.calls.count()).toBe(THREE);
    expect(service['pasteOffset']).toBe(0);

  });

  it('#undo should reduce the pasteoffset only if the undone operation is defined and it has a defined pasteOffset != 0', () => {
    const undoSpy = spyOn(service.undoRedoService, 'undo');
    undoSpy.and.returnValue(undefined);
    service['pasteOffset'] = FORTY;

    service.undo();
    expect(undoSpy.calls.count()).toBe(1);
    expect(service['pasteOffset']).toBe(FORTY);

    undoSpy.and.returnValue(dummyOperation);

    service.undo();
    expect(undoSpy.calls.count()).toBe(2);
    expect(service['pasteOffset']).toBe(FORTY);

    dummyOperation['pasteOffset'] = 0;
    undoSpy.and.returnValue(dummyOperation);

    service.undo();
    expect(undoSpy.calls.count()).toBe(THREE);
    expect(service['pasteOffset']).toBe(FORTY);

    dummyOperation['pasteOffset'] = FORTY;
    undoSpy.and.returnValue(dummyOperation);

    service.undo();
    expect(undoSpy.calls.count()).toBe(FOUR);
    expect(service['pasteOffset']).toBe(FORTY - NumericalValues.DUPLICATE_OFFSET);

  });

});
