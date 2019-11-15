import { TestBed } from '@angular/core/testing';
import { Id, ToolConstants } from 'src/app/drawing-view/components/tools/assets/constants/tool-constants';
import { ILine } from 'src/app/drawing-view/components/tools/assets/interfaces/drawing-tool-interface';
import { ITools } from 'src/app/drawing-view/components/tools/assets/interfaces/itools';
import { IShape } from 'src/app/drawing-view/components/tools/assets/interfaces/shape-interface';
import { DrawingStorageService } from '../drawing-storage/drawing-storage.service';
import { UndoRedoService } from './undo-redo.service';
import { CanvasInformationService } from '../canvas-information/canvas-information.service';
// tslint:disable:no-string-literal

describe('UndoRedoService', () => {
  let service: UndoRedoService;
  const undo = true;
  let dummyDrawing: ITools;
  let mockOperation: ITools;
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
    service.canevasInformation.data = {
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

    mockOperation = {
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
    const parserSpy = spyOn(service, 'handlersParser');
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
    const parserSpy = spyOn(service, 'handlersParser');

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

  it('#handlersParser should call the appropriate operation handler if necessary', () => {

    const eraserSpy = spyOn(service, 'handleEraserOperation');
    const primaryColourSpy = spyOn(service, 'handlePrimaryColourApplication');
    const secondaryColourSpy = spyOn(service, 'handleSecondaryColourApplication');

    dummyDrawing.id = '';
    service.handlersParser(dummyDrawing);

    dummyDrawing.id = Id.ERASER;
    service.handlersParser(dummyDrawing);
    expect(eraserSpy).toHaveBeenCalled();

    dummyDrawing.id = Id.PRIMARY_COLOUR_CHANGE;
    service.handlersParser(dummyDrawing);
    expect(primaryColourSpy).toHaveBeenCalled();

    dummyDrawing.id = Id.SECONDARY_COLOUR_CHANGE;
    service.handlersParser(dummyDrawing);
    expect(secondaryColourSpy).toHaveBeenCalled();

  });

  it('#handleEraseroperation should insert elements into drawing on undo,' +
  ' and remove them on redo', () => {

    service.drawingStorage.drawings = [mockOperation];
    const spliceSpy = spyOn(service.drawingStorage.drawings, 'splice');

    service.handleEraserOperation(dummyDrawing, undo);
    expect(spliceSpy).not.toHaveBeenCalled();

    dummyDrawing.objects = [mockOperation];

    service.handleEraserOperation(dummyDrawing, undo);
    expect(spliceSpy).not.toHaveBeenCalled();

    dummyDrawing.indexes = [0];

    service.handleEraserOperation(dummyDrawing, undo);
    expect(spliceSpy.calls.count()).toEqual(1);
    expect(spliceSpy.calls.mostRecent().args).toEqual([0, 0, mockOperation]);

    service.handleEraserOperation(dummyDrawing, !undo);
    expect(spliceSpy.calls.count()).toBe(2);
    expect(spliceSpy.calls.mostRecent().args).toEqual([0, 1]);

  });

  it('#handlePrimaryColourApplication should apply the initial colour on a undo' +
  ' and applicatedColour on a redo', () => {
   service.drawingStorage.drawings = [shapeDrawing];

   mockOperation.indexes = [ToolConstants.NULL];
   mockOperation.initialColour = 'initialColour';
   mockOperation.applicatedColour = undefined;
   
   service.handlePrimaryColourApplication(mockOperation, !undo);
   expect(service.canevasInformation.data.drawingColour).toBe('default');

   mockOperation.initialColour = undefined;
   mockOperation.applicatedColour = 'applicatedColour';

   service.handlePrimaryColourApplication(mockOperation, !undo);
   expect(service.canevasInformation.data.drawingColour).toBe('applicatedColour');

   mockOperation.indexes = undefined;
   mockOperation.initialColour = 'initialColour';
   mockOperation.applicatedColour = 'applicatedColour';

   service.handlePrimaryColourApplication(mockOperation, !undo);
   expect(service.drawingStorage.drawings[0].primaryColour).toBe('default');

   mockOperation.indexes = [0];
   mockOperation.initialColour = 'initialColour';
   mockOperation.applicatedColour = 'applicatedColour';

   service.handlePrimaryColourApplication(mockOperation, !undo);
   expect(service.drawingStorage.drawings[0].primaryColour).toBe('applicatedColour');

   service.handlePrimaryColourApplication(mockOperation, undo);
   expect(service.drawingStorage.drawings[0].primaryColour).toBe('initialColour');

   service.drawingStorage.drawings = [lineDrawing];

   service.handlePrimaryColourApplication(mockOperation, undo);
   expect(service.drawingStorage.drawings[0].colour).toBe('initialColour');

  });

  it('#handleSecondaryColourApplication should apply the initial colour on a undo' +
  ' and applicatedColour on a redo', () => {

   service.drawingStorage.drawings = [shapeDrawing];

   service.handleSecondaryColourApplication(mockOperation, !undo);
   expect(service.drawingStorage.drawings[0].primaryColour).toBe('default');

   mockOperation.indexes = [0];
   mockOperation.initialColour = 'initialColour';
   mockOperation.applicatedColour = 'applicatedColour';

   service.handleSecondaryColourApplication(mockOperation, !undo);
   expect(service.drawingStorage.drawings[0].secondaryColour).toBe('applicatedColour');

   service.handleSecondaryColourApplication(mockOperation, undo);
   expect(service.drawingStorage.drawings[0].secondaryColour).toBe('initialColour');

  });

});
