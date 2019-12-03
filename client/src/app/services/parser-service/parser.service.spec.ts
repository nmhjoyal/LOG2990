import { Id } from 'src/app/drawing-view/components/tools/assets/constants/tool-constants';
import { ITools } from 'src/app/drawing-view/components/tools/assets/interfaces/itools';
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
});
