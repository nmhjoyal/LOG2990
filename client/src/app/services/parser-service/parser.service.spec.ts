import { Id } from 'src/app/drawing-view/components/tools/assets/constants/tool-constants';
import { ITools } from 'src/app/drawing-view/components/tools/assets/interfaces/itools';
import { ControlPoints } from 'src/AppConstants/ControlPoints';
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
    const drawing: ITools = { x: 0, y: 0, id: Id.LINE, height: 2, width: 2, points: '0 0, 1 1' };
    const drawing2: ITools = { x: 0, y: 0, id: Id.LINE, height: 2, width: 2, vertices: '0 0, 1 1' };
    const drawing3: ITools = { x: 0, y: 0, id: Id.LINE, height: 2, width: 2, paths: [{ path: 'M1 4L5 6', pathWidth: 2 }] };
    ParserHelper.dragPolylinePoints(0, 0, drawing, selectorService);
    selectorService.resetSelectorService();
    ParserHelper.dragPolylinePoints(0, 0, drawing2, selectorService);
    selectorService.resetSelectorService();
    ParserHelper.dragPolylinePoints(2, 2, drawing3, selectorService);
    expect(drawing.points).toEqual('0 0, 1 1, 2 2');
    expect(drawing2.vertices).toEqual('0 0, 1 1, 2 2');
    expect(drawing3.paths).not.toEqual([{ path: 'M1 4L5 6', pathWidth: 2 }]);
  });

  it('should assign proper values according to switch cases', () => {
    const drawing: ITools = { x: 0, y: 0, id: Id.LINE, height: 2, width: 2, points: '0 0, 1 1' };
    const drawing2: ITools = { x: 0, y: 0, id: Id.LINE, height: 2, width: 2, vertices: '0 0, 1 1' };
    const drawing3: ITools = { x: 0, y: 0, id: Id.LINE, height: 2, width: 2, paths: [{ path: 'M1 4L5 6', pathWidth: 2 }] };
    const spyPoints = spyOn(ParserHelper, 'setPoints');
    const spyPaths = spyOn(ParserHelper, 'setPaths')
    ParserHelper.snapPolylinePoints(0, 0, drawing, selectorService, ControlPoints.TOP_LEFT, gridService);
    ParserHelper.snapPolylinePoints(0, 0, drawing2, selectorService, ControlPoints.TOP_LEFT, gridService);
    ParserHelper.snapPolylinePoints(0, 0, drawing3, selectorService, ControlPoints.TOP_LEFT, gridService);
    expect(spyPoints).toHaveBeenCalled();
    expect(spyPaths).toHaveBeenCalled();

    ParserHelper.snapPolylinePoints(0, 0, drawing, selectorService, ControlPoints.TOP_MIDDLE, gridService);
    ParserHelper.snapPolylinePoints(0, 0, drawing2, selectorService, ControlPoints.TOP_MIDDLE, gridService);
    ParserHelper.snapPolylinePoints(0, 0, drawing3, selectorService, ControlPoints.TOP_MIDDLE, gridService);
    expect(spyPoints).toHaveBeenCalled();
    expect(spyPaths).toHaveBeenCalled();

    ParserHelper.snapPolylinePoints(0, 0, drawing, selectorService, ControlPoints.TOP_RIGHT, gridService);
    ParserHelper.snapPolylinePoints(0, 0, drawing2, selectorService, ControlPoints.TOP_RIGHT, gridService);
    ParserHelper.snapPolylinePoints(0, 0, drawing3, selectorService, ControlPoints.TOP_RIGHT, gridService);
    expect(spyPoints).toHaveBeenCalled();
    expect(spyPaths).toHaveBeenCalled();

    ParserHelper.snapPolylinePoints(0, 0, drawing, selectorService, ControlPoints.MIDDLE_LEFT, gridService);
    ParserHelper.snapPolylinePoints(0, 0, drawing2, selectorService, ControlPoints.MIDDLE_LEFT, gridService);
    ParserHelper.snapPolylinePoints(0, 0, drawing3, selectorService, ControlPoints.MIDDLE_LEFT, gridService);
    expect(spyPoints).toHaveBeenCalled();
    expect(spyPaths).toHaveBeenCalled();

    ParserHelper.snapPolylinePoints(0, 0, drawing, selectorService, ControlPoints.MIDDLE, gridService);
    ParserHelper.snapPolylinePoints(0, 0, drawing2, selectorService, ControlPoints.MIDDLE, gridService);
    ParserHelper.snapPolylinePoints(0, 0, drawing3, selectorService, ControlPoints.MIDDLE, gridService);
    expect(spyPoints).toHaveBeenCalled();
    expect(spyPaths).toHaveBeenCalled();

    ParserHelper.snapPolylinePoints(0, 0, drawing, selectorService, ControlPoints.MIDDLE_RIGHT, gridService);
    ParserHelper.snapPolylinePoints(0, 0, drawing2, selectorService, ControlPoints.MIDDLE_RIGHT, gridService);
    ParserHelper.snapPolylinePoints(0, 0, drawing3, selectorService, ControlPoints.MIDDLE_RIGHT, gridService);
    expect(spyPoints).toHaveBeenCalled();
    expect(spyPaths).toHaveBeenCalled();

    ParserHelper.snapPolylinePoints(0, 0, drawing, selectorService, ControlPoints.BOTTOM_LEFT, gridService);
    ParserHelper.snapPolylinePoints(0, 0, drawing2, selectorService, ControlPoints.BOTTOM_LEFT, gridService);
    ParserHelper.snapPolylinePoints(0, 0, drawing3, selectorService, ControlPoints.BOTTOM_LEFT, gridService);
    expect(spyPoints).toHaveBeenCalled();
    expect(spyPaths).toHaveBeenCalled();

    ParserHelper.snapPolylinePoints(0, 0, drawing, selectorService, ControlPoints.BOTTOM_MIDDLE, gridService);
    ParserHelper.snapPolylinePoints(0, 0, drawing2, selectorService, ControlPoints.BOTTOM_MIDDLE, gridService);
    ParserHelper.snapPolylinePoints(0, 0, drawing3, selectorService, ControlPoints.BOTTOM_MIDDLE, gridService);
    expect(spyPoints).toHaveBeenCalled();
    expect(spyPaths).toHaveBeenCalled();

    ParserHelper.snapPolylinePoints(0, 0, drawing, selectorService, ControlPoints.BOTTOM_RIGHT, gridService);
    ParserHelper.snapPolylinePoints(0, 0, drawing2, selectorService, ControlPoints.BOTTOM_RIGHT, gridService);
    ParserHelper.snapPolylinePoints(0, 0, drawing3, selectorService, ControlPoints.BOTTOM_RIGHT, gridService);
    expect(spyPoints).toHaveBeenCalled();
    expect(spyPaths).toHaveBeenCalled();

    ParserHelper.snapPolylinePoints(0, 0, drawing, selectorService, ControlPoints.NONE, gridService);
    ParserHelper.snapPolylinePoints(0, 0, drawing2, selectorService, ControlPoints.NONE, gridService);
    ParserHelper.snapPolylinePoints(0, 0, drawing3, selectorService, ControlPoints.NONE, gridService);
    expect(spyPoints).toHaveBeenCalled();
    expect(spyPaths).toHaveBeenCalled();
  });

  it('#setPaths should properly set paths of an object', () => {
    const quill: ITools = { id: Id.QUILL, x: 0, y: 0, width: 1, height: 1, paths: [] };
    quill.paths = [{ path: 'M1 4L5 6', pathWidth: 2 }]
    ParserHelper.setPaths(quill, 0, 0, 0, 0); // no change expected
    expect(quill.paths[0].path).toEqual('M1 4L5 6');
    expect(quill.points).toBeUndefined();
  })

  it('#setPoints should properly set the points of an object', () => {
    const pen: ITools = { id: Id.QUILL, x: 0, y: 0, width: 1, height: 1, points: '0 0, 1 1' };
    ParserHelper.setPoints(['0 0', '1 1'], 0, 0, 0, 0); // no change expected
    expect(pen.points).toEqual('0 0, 1 1');
    expect(pen.paths).toBeUndefined();
  });
});
