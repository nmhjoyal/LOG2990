// tslint:disable:no-string-literal
// tslint:disable:no-magic-numbers
import { Id } from 'src/app/drawing-view/components/tools/assets/constants/tool-constants';
import { IComplexPath } from 'src/app/drawing-view/components/tools/assets/interfaces/drawing-tool-interface';
import { ITools } from 'src/app/drawing-view/components/tools/assets/interfaces/itools';
import { ControlPoints } from 'src/AppConstants/ControlPoints';
import { ISavedDrawing } from '../../../../../common/drawing-information/IDrawing';
import { CanvasInformationService } from '../canvas-information/canvas-information.service';
import { DrawingStorageService } from '../drawing-storage/drawing-storage.service';
import { GridService } from '../grid/grid.service';
import { SaveService } from '../save-service/save.service';
import { SelectorService } from '../selector-service/selector-service';
import { UndoRedoService } from '../undo-redo/undo-redo.service';
import ParserHelper from './parser.service';

describe('ParserServiceService', () => {
  let selectorService: SelectorService;
  let saveService: SaveService;
  let drawingStorageService: DrawingStorageService;
  let undoRedoService: UndoRedoService;
  let canvasInformationService: CanvasInformationService;
  const gridService = new GridService();

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

  beforeEach(() => {
    drawingStorageService = new DrawingStorageService();
    canvasInformationService = new CanvasInformationService();
    undoRedoService = new UndoRedoService(drawingStorageService, canvasInformationService);
    saveService = new SaveService(drawingStorageService, undoRedoService);
    selectorService = new SelectorService(saveService);
  });

  it('should be created', () => {
    expect(ParserHelper).toBeTruthy();
  });

  it('should give new values to points', () => {
    spyOn(ParserHelper, 'initializePoints').and.returnValue('0 0, 1 1, 2 2');
    const drawing1: ITools = { x: 0, y: 0, id: Id.LINE, height: 2, width: 2, points: '0 0, 1 1' };
    const drawing2: ITools = { x: 0, y: 0, id: Id.LINE, height: 2, width: 2, vertices: '0 0, 1 1' };
    const drawing3: ITools = { x: 0, y: 0, id: Id.LINE, height: 2, width: 2, paths: [{ path: 'M1 4L5 6', pathWidth: 2 }] };
    ParserHelper.dragPolylinePoints(0, 0, drawing1, selectorService);
    selectorService.resetSelectorService();
    ParserHelper.dragPolylinePoints(0, 0, drawing2, selectorService);
    selectorService.resetSelectorService();
    ParserHelper.dragPolylinePoints(2, 2, drawing3, selectorService);
    expect(drawing1.points).toEqual('0 0, 1 1, 2 2');
    expect(drawing2.vertices).toEqual('0 0, 1 1, 2 2');
    expect(drawing3.paths).not.toEqual([{ path: 'M1 4L5 6', pathWidth: 2 }]);
  });

  it('should assign proper values according to switch cases', () => {
    const drawing1: ITools = { x: 0, y: 0, id: Id.LINE, height: 2, width: 2, points: '0 0, 1 1' };
    const drawing2: ITools = { x: 0, y: 0, id: Id.LINE, height: 2, width: 2, vertices: '0 0, 1 1' };
    const drawing3: ITools = { x: 0, y: 0, id: Id.LINE, height: 2, width: 2, paths: [{ path: 'M1 4L5 6', pathWidth: 2 }] };
    const spyPoints = spyOn(ParserHelper, 'setPoints');
    const spyPaths = spyOn(ParserHelper, 'setPaths');
    ParserHelper.snapPolylinePoints(0, 0, drawing1, selectorService, ControlPoints.TOP_LEFT, gridService);
    ParserHelper.snapPolylinePoints(0, 0, drawing2, selectorService, ControlPoints.TOP_LEFT, gridService);
    ParserHelper.snapPolylinePoints(0, 0, drawing3, selectorService, ControlPoints.TOP_LEFT, gridService);
    expect(spyPoints).toHaveBeenCalled();
    expect(spyPaths).toHaveBeenCalled();

    ParserHelper.snapPolylinePoints(0, 0, drawing1, selectorService, ControlPoints.TOP_MIDDLE, gridService);
    ParserHelper.snapPolylinePoints(0, 0, drawing2, selectorService, ControlPoints.TOP_MIDDLE, gridService);
    ParserHelper.snapPolylinePoints(0, 0, drawing3, selectorService, ControlPoints.TOP_MIDDLE, gridService);
    expect(spyPoints).toHaveBeenCalled();
    expect(spyPaths).toHaveBeenCalled();

    ParserHelper.snapPolylinePoints(0, 0, drawing1, selectorService, ControlPoints.TOP_RIGHT, gridService);
    ParserHelper.snapPolylinePoints(0, 0, drawing2, selectorService, ControlPoints.TOP_RIGHT, gridService);
    ParserHelper.snapPolylinePoints(0, 0, drawing3, selectorService, ControlPoints.TOP_RIGHT, gridService);
    expect(spyPoints).toHaveBeenCalled();
    expect(spyPaths).toHaveBeenCalled();

    ParserHelper.snapPolylinePoints(0, 0, drawing1, selectorService, ControlPoints.MIDDLE_LEFT, gridService);
    ParserHelper.snapPolylinePoints(0, 0, drawing2, selectorService, ControlPoints.MIDDLE_LEFT, gridService);
    ParserHelper.snapPolylinePoints(0, 0, drawing3, selectorService, ControlPoints.MIDDLE_LEFT, gridService);
    expect(spyPoints).toHaveBeenCalled();
    expect(spyPaths).toHaveBeenCalled();

    ParserHelper.snapPolylinePoints(0, 0, drawing1, selectorService, ControlPoints.MIDDLE, gridService);
    ParserHelper.snapPolylinePoints(0, 0, drawing2, selectorService, ControlPoints.MIDDLE, gridService);
    ParserHelper.snapPolylinePoints(0, 0, drawing3, selectorService, ControlPoints.MIDDLE, gridService);
    expect(spyPoints).toHaveBeenCalled();
    expect(spyPaths).toHaveBeenCalled();

    ParserHelper.snapPolylinePoints(0, 0, drawing1, selectorService, ControlPoints.MIDDLE_RIGHT, gridService);
    ParserHelper.snapPolylinePoints(0, 0, drawing2, selectorService, ControlPoints.MIDDLE_RIGHT, gridService);
    ParserHelper.snapPolylinePoints(0, 0, drawing3, selectorService, ControlPoints.MIDDLE_RIGHT, gridService);
    expect(spyPoints).toHaveBeenCalled();
    expect(spyPaths).toHaveBeenCalled();

    ParserHelper.snapPolylinePoints(0, 0, drawing1, selectorService, ControlPoints.BOTTOM_LEFT, gridService);
    ParserHelper.snapPolylinePoints(0, 0, drawing2, selectorService, ControlPoints.BOTTOM_LEFT, gridService);
    ParserHelper.snapPolylinePoints(0, 0, drawing3, selectorService, ControlPoints.BOTTOM_LEFT, gridService);
    expect(spyPoints).toHaveBeenCalled();
    expect(spyPaths).toHaveBeenCalled();

    ParserHelper.snapPolylinePoints(0, 0, drawing1, selectorService, ControlPoints.BOTTOM_MIDDLE, gridService);
    ParserHelper.snapPolylinePoints(0, 0, drawing2, selectorService, ControlPoints.BOTTOM_MIDDLE, gridService);
    ParserHelper.snapPolylinePoints(0, 0, drawing3, selectorService, ControlPoints.BOTTOM_MIDDLE, gridService);
    expect(spyPoints).toHaveBeenCalled();
    expect(spyPaths).toHaveBeenCalled();

    ParserHelper.snapPolylinePoints(0, 0, drawing1, selectorService, ControlPoints.BOTTOM_RIGHT, gridService);
    ParserHelper.snapPolylinePoints(0, 0, drawing2, selectorService, ControlPoints.BOTTOM_RIGHT, gridService);
    ParserHelper.snapPolylinePoints(0, 0, drawing3, selectorService, ControlPoints.BOTTOM_RIGHT, gridService);
    expect(spyPoints).toHaveBeenCalled();
    expect(spyPaths).toHaveBeenCalled();

    ParserHelper.snapPolylinePoints(0, 0, drawing1, selectorService, ControlPoints.NONE, gridService);
    ParserHelper.snapPolylinePoints(0, 0, drawing2, selectorService, ControlPoints.NONE, gridService);
    ParserHelper.snapPolylinePoints(0, 0, drawing3, selectorService, ControlPoints.NONE, gridService);
    expect(spyPoints).toHaveBeenCalled();
    expect(spyPaths).toHaveBeenCalled();
  });

  it('#setPaths should properly set paths of an object', () => {
    const quill: ITools = { id: Id.QUILL, x: 0, y: 0, width: 1, height: 1, paths: [] };
    quill.paths = [{ path: 'M1 4L5 6', pathWidth: 2 }];
    ParserHelper.setPaths(quill, 0, 0, 0, 0); // no change expected
    expect(quill.paths[0].path).toEqual('M1 4L5 6');
    expect(quill.points).toBeUndefined();
  });

  it('#setPoints should properly set the points of an object', () => {
    const pen: ITools = { id: Id.QUILL, x: 0, y: 0, width: 1, height: 1, points: '0 0, 1 1' };
    ParserHelper.setPoints(['0 0', '1 1'], 0, 0, 0, 0); // no change expected
    expect(pen.points).toEqual('0 0, 1 1');
    expect(pen.paths).toBeUndefined();
  });

  it('should move objects correctly', () => {
    ParserHelper.moveObject(5, 5, line);
    expect(line.points).toEqual('9 9, 11 11');

    ParserHelper.moveObject(5, 5, polygon);
    expect(polygon.vertices).toEqual('5 5, 6 6, 7 7');

    ParserHelper.moveObject(5, 5, path);
    const newPath: IComplexPath[] = [{ path: 'M6 9L10 11', pathWidth: 2 }];
    expect(path.paths).toEqual(newPath);

    ParserHelper.moveObject(5, 5, drawing);
    expect(drawing.points).toEqual(undefined);

    ParserHelper.moveObject(5, 5, drawing);
    expect(drawing.paths).toEqual(undefined);
  });
});
