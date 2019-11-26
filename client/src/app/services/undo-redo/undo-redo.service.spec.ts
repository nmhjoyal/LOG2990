import { TestBed } from '@angular/core/testing';
import { Id, ToolConstants } from 'src/app/drawing-view/components/tools/assets/constants/tool-constants';
import { ILine } from 'src/app/drawing-view/components/tools/assets/interfaces/drawing-tool-interface';
import { ITools } from 'src/app/drawing-view/components/tools/assets/interfaces/itools';
import { IShape } from 'src/app/drawing-view/components/tools/assets/interfaces/shape-interface';
import { CanvasInformationService } from '../canvas-information/canvas-information.service';
import { DrawingStorageService } from '../drawing-storage/drawing-storage.service';
import { UndoRedoService } from './undo-redo.service';
// tslint:disable:no-string-literal

describe('UndoRedoService', () => {
  let service: UndoRedoService;
  const undo = true;
  let dummyDrawing: ITools;
  let dummyDrawing2: ITools;
  let shapeDrawing: IShape;
  let lineDrawing: ILine;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CanvasInformationService,
        DrawingStorageService,
        UndoRedoService,
      ],
    });
    service = TestBed.get(UndoRedoService);
    service.canvasInformation.data = {
      drawingHeight: 0,
      drawingWidth: 0,
      drawingColour: 'default',
    };

    dummyDrawing = {
      id: '',
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    };

    dummyDrawing2 = {
      id: '',
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    };

    shapeDrawing = {
      primaryColour: 'default',
      secondaryColour: 'default',
      id: '',
      strokeOpacity: 0,
      strokeWidth: 0,
      fillOpacity: 0,
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    };

    lineDrawing = {
      colour: '',
      id: '',
      strokeOpacity: 0,
      strokeWidth: 0,
      fill: '',
      pointWidth: 0,
      strokeLinecap: '',
      strokeLinejoin: '',
      strokeDashArray: '',
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    };

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#undo should set accessingUndoList to true and transfer the last object from drawings' +
      'to undoList if it is not undefined', () => {
    const drawingsSpy = spyOn(service.drawingStorage.drawings, 'pop');
    const undoListSpy = spyOn(service.undoList, 'push');
    const parserSpy = spyOn(service, 'parseHandlers');
    drawingsSpy.and.returnValue(undefined);

    service.undo();

    expect(service.accessingUndoList).toBe(true);
    expect(service['isUndoing']).toBe(true);
    expect(drawingsSpy.calls.count()).toBe(1);
    expect(undoListSpy).not.toHaveBeenCalled();
    expect(parserSpy).not.toHaveBeenCalled();

    service.accessingUndoList = false;
    service['isUndoing'] = false;
    drawingsSpy.and.returnValue(dummyDrawing);

    service.undo();

    expect(service.accessingUndoList).toBe(true);
    expect(service['isUndoing']).toBe(true);
    expect(drawingsSpy.calls.count()).toBe(2);
    expect(undoListSpy).toHaveBeenCalled();
    expect(parserSpy).toHaveBeenCalled();
  });

  it('#redo should transfer the last object from undoList ' +
      'to drawings if it is not undefined', () => {

    const drawingsSpy = spyOn(service.drawingStorage.drawings, 'push');
    const undoListSpy = spyOn(service.undoList, 'pop');
    const parserSpy = spyOn(service, 'parseHandlers');

    service.redo();

    expect(service['isUndoing']).toBe(false);
    expect(undoListSpy.calls.count()).toBe(1);
    expect(drawingsSpy).not.toHaveBeenCalled();
    expect(parserSpy).not.toHaveBeenCalled();

    service['isUndoing'] = true;
    undoListSpy.and.returnValue(dummyDrawing);

    service.redo();

    expect(undoListSpy.calls.count()).toBe(2);
    expect(drawingsSpy).toHaveBeenCalled();
    expect(service['isUndoing']).toBe(false);
    expect(parserSpy).toHaveBeenCalled();
  });

  it('#parseHandlers should call the appropriate operation handler if necessary', () => {

    const eraserSpy = spyOn(service, 'handleEraserOperation');
    const primaryColourSpy = spyOn(service, 'handlePrimaryColourApplication');
    const secondaryColourSpy = spyOn(service, 'handleSecondaryColourApplication');

    dummyDrawing.id = '';
    service.parseHandlers(dummyDrawing);

    dummyDrawing.id = Id.ERASER;
    service.parseHandlers(dummyDrawing);
    expect(eraserSpy).toHaveBeenCalled();

    dummyDrawing.id = Id.PRIMARY_COLOUR_CHANGE;
    service.parseHandlers(dummyDrawing);
    expect(primaryColourSpy).toHaveBeenCalled();

    dummyDrawing.id = Id.SECONDARY_COLOUR_CHANGE;
    service.parseHandlers(dummyDrawing);
    expect(secondaryColourSpy).toHaveBeenCalled();

  });

  it('#handleEraseroperation should insert elements into drawing on undo,' +
  ' and remove them on redo', () => {

    service.drawingStorage.drawings = [dummyDrawing2];
    const spliceSpy = spyOn(service.drawingStorage.drawings, 'splice');

    service.handleEraserOperation(dummyDrawing, undo);
    expect(spliceSpy).not.toHaveBeenCalled();

    dummyDrawing.objects = [dummyDrawing2];

    service.handleEraserOperation(dummyDrawing, undo);
    expect(spliceSpy).not.toHaveBeenCalled();

    dummyDrawing.indexes = [0];

    service.handleEraserOperation(dummyDrawing, undo);
    expect(spliceSpy.calls.count()).toEqual(1);
    expect(spliceSpy.calls.mostRecent().args).toEqual([0, 0, dummyDrawing2]);

    service.handleEraserOperation(dummyDrawing, !undo);
    expect(spliceSpy.calls.count()).toBe(2);
    expect(spliceSpy.calls.mostRecent().args).toEqual([0, 1]);

  });

  it('#handlePrimaryColourApplication should apply the initial colour on a undo' +
  ' and appliedColour on a redo', () => {
   service.drawingStorage.drawings = [shapeDrawing];

   dummyDrawing2.indexes = [ToolConstants.NULL];
   dummyDrawing2.initialColour = 'initialColour';
   dummyDrawing2.appliedColour = undefined;

   service.handlePrimaryColourApplication(dummyDrawing2, !undo);
   expect(service.canvasInformation.data.drawingColour).toBe('default');

   dummyDrawing2.initialColour = undefined;
   dummyDrawing2.appliedColour = 'appliedColour';

   service.handlePrimaryColourApplication(dummyDrawing2, !undo);
   expect(service.canvasInformation.data.drawingColour).toBe('appliedColour');

   dummyDrawing2.indexes = undefined;
   dummyDrawing2.initialColour = 'initialColour';
   dummyDrawing2.appliedColour = 'appliedColour';

   service.handlePrimaryColourApplication(dummyDrawing2, !undo);
   expect(service.drawingStorage.drawings[0].primaryColour).toBe('default');

   dummyDrawing2.indexes = [0];
   dummyDrawing2.initialColour = 'initialColour';
   dummyDrawing2.appliedColour = 'appliedColour';

   service.handlePrimaryColourApplication(dummyDrawing2, !undo);
   expect(service.drawingStorage.drawings[0].primaryColour).toBe('appliedColour');

   service.handlePrimaryColourApplication(dummyDrawing2, undo);
   expect(service.drawingStorage.drawings[0].primaryColour).toBe('initialColour');

   service.drawingStorage.drawings = [lineDrawing];

   service.handlePrimaryColourApplication(dummyDrawing2, undo);
   expect(service.drawingStorage.drawings[0].colour).toBe('initialColour');

  });

  it('#handleSecondaryColourApplication should apply the initial colour on a undo' +
  ' and appliedColour on a redo', () => {

   service.drawingStorage.drawings = [shapeDrawing];

   service.handleSecondaryColourApplication(dummyDrawing2, !undo);
   expect(service.drawingStorage.drawings[0].primaryColour).toBe('default');

   dummyDrawing2.indexes = [0];
   dummyDrawing2.initialColour = 'initialColour';
   dummyDrawing2.appliedColour = 'appliedColour';

   service.handleSecondaryColourApplication(dummyDrawing2, !undo);
   expect(service.drawingStorage.drawings[0].secondaryColour).toBe('appliedColour');

   service.handleSecondaryColourApplication(dummyDrawing2, undo);
   expect(service.drawingStorage.drawings[0].secondaryColour).toBe('initialColour');

  });

});
