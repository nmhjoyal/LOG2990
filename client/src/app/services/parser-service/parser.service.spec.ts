// tslint:disable:no-string-literal
// tslint:disable:no-magic-numbers
import { Id } from 'src/app/drawing-view/components/tools/assets/constants/tool-constants';
import { IComplexPath } from 'src/app/drawing-view/components/tools/assets/interfaces/drawing-tool-interface';
import { ITools } from 'src/app/drawing-view/components/tools/assets/interfaces/itools';
import { ISavedDrawing } from '../../../../../common/drawing-information/IDrawing';
import { CanvasInformationService } from '../canvas-information/canvas-information.service';
import { DrawingStorageService } from '../drawing-storage/drawing-storage.service';
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

  it('should move objects correctly', () => {
    ParserHelper.moveObject(5, 5, line);
    expect(line.points).toEqual('9 9, 11 11');

    ParserHelper.moveObject(5, 5, polygon);
    expect(polygon.vertices).toEqual('5 5, 6 6, 7 7');

    ParserHelper.moveObject(5, 5, path);
    const newPath: IComplexPath[] = [{path: 'M6 9L10 11', pathWidth: 2}];
    expect(path.paths).toEqual(newPath);

    ParserHelper.moveObject(5, 5, drawing);
    expect(drawing.points).toEqual(undefined);

    ParserHelper.moveObject(5, 5, drawing);
    expect(drawing.paths).toEqual(undefined);
  });
});
