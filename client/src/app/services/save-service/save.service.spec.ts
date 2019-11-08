import { TestBed } from '@angular/core/testing';

import { ITools } from 'src/app/drawing-view/components/tools/assets/interfaces/itools';
import { DrawingStorageService } from '../drawing-storage/drawing-storage.service';
import { SelectorService } from '../selector-service/selector-service';
import { UndoRedoService } from '../undo-redo/undo-redo.service';
import { SaveService } from './save.service';

const DUMMY_LENGTH = 3;

describe('SaveService', () => {
  let service: SaveService;
  const drawingStorageMock: jasmine.SpyObj<DrawingStorageService> = jasmine.createSpyObj('DrawingStorageService', ['saveDrawing']);
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UndoRedoService,
        SelectorService,
        { provide: DrawingStorageService, useValue: drawingStorageMock },
      ],
    });
    service = TestBed.get(SaveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#saveDrawing should call the savedrawing of drawingstorage and conditionally empty undolist', () => {
    service.undoRedo.accessingUndoList = false;
    const dummyDrawing: ITools = {
      id: 'dummy',
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    };
    service.undoRedo.undoList = [dummyDrawing, dummyDrawing, dummyDrawing];
    service.saveDrawing(dummyDrawing);
    // tslint:disable-next-line:no-magic-numbers
    expect(drawingStorageMock.saveDrawing.calls.count()).toBe(1);
    expect(service.undoRedo.undoList.length).toBe(DUMMY_LENGTH);

    service.undoRedo.accessingUndoList = true;
    service.saveDrawing(dummyDrawing);
    // tslint:disable-next-line:no-magic-numbers
    expect(drawingStorageMock.saveDrawing.calls.count()).toBe(2);
    expect(service.undoRedo.undoList.length).toBe(0);
    expect(service.undoRedo.accessingUndoList).toBe(false);

  });
});
