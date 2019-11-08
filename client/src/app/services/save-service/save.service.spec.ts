import { TestBed } from '@angular/core/testing';

import { SaveService } from './save.service';
import { DrawingStorageService } from '../drawing-storage/drawing-storage.service';
import { UndoRedoService } from '../undo-redo/undo-redo.service';
import { ITools } from 'src/app/drawing-view/components/tools/assets/interfaces/itools';

const DUMMY_LENGTH = 3;

describe('SaveService', () => {
  let service: SaveService;
  let undoListSpy: jasmine.Spy<InferableFunction>;
  let accessingUndospy: jasmine.Spy<InferableFunction>;
  const drawingStorageMock: jasmine.SpyObj<DrawingStorageService> = jasmine.createSpyObj('DrawingStorageService', ['saveDrawing']);
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UndoRedoService,
        { provide: DrawingStorageService, useValue: drawingStorageMock }
      ],
    });
    service = TestBed.get(SaveService);
    undoListSpy = spyOnProperty(TestBed.get(UndoRedoService).undoList, 'length');
    accessingUndospy = spyOnProperty(TestBed.get(UndoRedoService), 'accessingUndoList');

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#saveDrawing should call the savedrawing of drawingstorage and conditionally empty undolist', () => {
    accessingUndospy.and.returnValue(false);
    service.undoRedo.undoList.length = DUMMY_LENGTH;
    const dummyDrawing: ITools = {
      id: 'dummy',
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    }
    service.saveDrawing(dummyDrawing);
    // tslint:disable-next-line:no-magic-numbers
    expect(drawingStorageMock.saveDrawing.calls.count).toBe(1);
    expect(undoListSpy).toBe(DUMMY_LENGTH);

    accessingUndospy.and.returnValue(true);
    service.saveDrawing(dummyDrawing);
    // tslint:disable-next-line:no-magic-numbers
    expect(drawingStorageMock.saveDrawing.calls.count).toBe(2);
    expect(undoListSpy).toBe(0);
    expect(accessingUndospy.accessingUndoList).toBe(false); // don,t think that works

  });
});
