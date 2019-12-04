import { TestBed } from '@angular/core/testing';

import { Id } from 'src/app/drawing-view/components/tools/assets/constants/tool-constants';
import { ControlPoints } from 'src/AppConstants/ControlPoints';
import { ISavedDrawing } from '../../../../../common/drawing-information/IDrawing';
import { CanvasInformationService } from '../canvas-information/canvas-information.service';
import { DrawingStorageService } from '../drawing-storage/drawing-storage.service';
import { GridService } from '../grid/grid.service';
import ParserHelper from '../parser-service/parser.service';
import { SaveService } from '../save-service/save.service';
import { SelectorService } from '../selector-service/selector-service';
import { UndoRedoService } from '../undo-redo/undo-redo.service';
import { DragService } from './drag.service';

describe('DragService', () => {
  let dragService: DragService;
  const drawingStorage: DrawingStorageService = new DrawingStorageService();
  const canvasInformation: CanvasInformationService = new CanvasInformationService();
  const undoRedo: UndoRedoService = new UndoRedoService(drawingStorage, canvasInformation);
  const saveService: SaveService = new SaveService(drawingStorage, undoRedo);
  const selectorService: SelectorService = new SelectorService(saveService);
  const gridService: GridService = new GridService();
  beforeEach(() => {
    dragService = new DragService(selectorService, gridService);
  });

  it('should be created', () => {
    const service: DragService = TestBed.get(DragService);
    expect(service).toBeTruthy();
  });

  it('should accomplish expected behaviour for each switch case', () => {
    const spy = spyOn(ParserHelper, 'snapPolylinePoints');
    const originalCoordinate = 1;
    const originalDimension = 2;
    const windowDimensions = 10;
    const cursorCoordinate = 0;
    const rectangle = {
      id: Id.RECTANGLE,
      x: originalCoordinate,
      y: originalCoordinate,
      width: originalDimension,
      height: originalDimension,
    };

    const text = {
      id: Id.RECTANGLE,
      x: originalCoordinate,
      y: originalCoordinate,
      width: originalDimension,
      height: originalDimension,
      alignX: originalCoordinate,
    };

    dragService.selectorService.topCornerX = originalCoordinate;
    dragService.selectorService.furthestX = originalDimension;
    dragService.selectorService.selectedObjects.add(rectangle);
    dragService.selectorService.selectedObjects.add(text);
    dragService.snapObjects(cursorCoordinate, cursorCoordinate, windowDimensions, windowDimensions, ControlPoints.TOP_LEFT);
    expect((rectangle as ISavedDrawing).alignX).toBeUndefined();
    expect(text.alignX).toBeDefined();
    expect(spy).toHaveBeenCalledTimes(2 * ControlPoints.TOP_LEFT + 2);

    text.alignX = originalCoordinate;
    dragService.snapObjects(cursorCoordinate, cursorCoordinate, windowDimensions, windowDimensions, ControlPoints.TOP_MIDDLE);
    expect((rectangle as ISavedDrawing).alignX).toBeUndefined();
    expect(text.alignX).toBeDefined();
    expect(spy).toHaveBeenCalledTimes(2 * ControlPoints.TOP_MIDDLE + 2);

    text.alignX = originalCoordinate;
    dragService.snapObjects(cursorCoordinate, cursorCoordinate, windowDimensions, windowDimensions, ControlPoints.TOP_RIGHT);
    expect((rectangle as ISavedDrawing).alignX).toBeUndefined();
    expect(text.alignX).toBeDefined();
    expect(spy).toHaveBeenCalledTimes(2 * ControlPoints.TOP_RIGHT + 2);

    text.alignX = originalCoordinate;
    dragService.snapObjects(cursorCoordinate, cursorCoordinate, windowDimensions, windowDimensions, ControlPoints.MIDDLE_LEFT);
    expect((rectangle as ISavedDrawing).alignX).toBeUndefined();
    expect(text.alignX).toBeDefined();
    expect(spy).toHaveBeenCalledTimes(2 * ControlPoints.MIDDLE_LEFT + 2);

    text.alignX = originalCoordinate;
    dragService.snapObjects(cursorCoordinate, cursorCoordinate, windowDimensions, windowDimensions, ControlPoints.MIDDLE);
    expect((rectangle as ISavedDrawing).alignX).toBeUndefined();
    expect(text.alignX).toBeDefined();
    expect(spy).toHaveBeenCalledTimes(2 * ControlPoints.MIDDLE + 2);

    text.alignX = originalCoordinate;
    dragService.snapObjects(cursorCoordinate, cursorCoordinate, windowDimensions, windowDimensions, ControlPoints.MIDDLE_RIGHT);
    expect((rectangle as ISavedDrawing).alignX).toBeUndefined();
    expect(text.alignX).toBeDefined();
    expect(spy).toHaveBeenCalledTimes(2 * ControlPoints.MIDDLE_RIGHT + 2);

    text.alignX = originalCoordinate;
    dragService.snapObjects(cursorCoordinate, cursorCoordinate, windowDimensions, windowDimensions, ControlPoints.BOTTOM_LEFT);
    expect((rectangle as ISavedDrawing).alignX).toBeUndefined();
    expect(text.alignX).toBeDefined();
    expect(spy).toHaveBeenCalledTimes(2 * ControlPoints.BOTTOM_LEFT + 2);

    text.alignX = originalCoordinate;
    dragService.snapObjects(cursorCoordinate, cursorCoordinate, windowDimensions, windowDimensions, ControlPoints.BOTTOM_MIDDLE);
    expect((rectangle as ISavedDrawing).alignX).toBeUndefined();
    expect(text.alignX).toBeDefined();
    expect(spy).toHaveBeenCalledTimes(2 * ControlPoints.BOTTOM_MIDDLE + 2);

    text.alignX = originalCoordinate;
    dragService.snapObjects(cursorCoordinate, cursorCoordinate, windowDimensions, windowDimensions, ControlPoints.BOTTOM_RIGHT);
    expect((rectangle as ISavedDrawing).alignX).toBeUndefined();
    expect(text.alignX).toBeDefined();
    expect(spy).toHaveBeenCalledTimes(2 * ControlPoints.BOTTOM_RIGHT + 2);

    // tslint:disable-next-line: no-magic-numbers
    text.alignX = originalCoordinate;
    dragService.snapObjects(cursorCoordinate, cursorCoordinate, windowDimensions, windowDimensions, ControlPoints.NONE);
    expect((rectangle as ISavedDrawing).alignX).toBeUndefined();
    expect(text.alignX).toBeDefined();
    expect(spy).toHaveBeenCalledTimes(2 * ControlPoints.BOTTOM_RIGHT + 2 + 2);
  });

  it('#toggleSnapping should invert shouldSnap status', () => {
    dragService.shouldSnap = false;
    dragService.toggleSnapping();
    expect(dragService.shouldSnap).toEqual(true);
    dragService.toggleSnapping();
    expect(dragService.shouldSnap).toEqual(false);
  });
});
