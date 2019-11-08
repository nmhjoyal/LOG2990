import { TestBed } from '@angular/core/testing';

import { UndoRedoService } from './undo-redo.service';
import { ITools } from 'src/app/drawing-view/components/tools/assets/interfaces/itools';
import { SelectorService } from '../selector-service/selector-service';

describe('UndoRedoService', () => {
  let service: UndoRedoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: SelectorService },
      ],
    });
    service = TestBed.get(UndoRedoService);
    let undoListSpy = spyOn(service.undoList, 'pop');
    let drawingsSpy = spyOn(service.drawingStorage.drawings, 'pop');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  
  it('#undo should set accessingUndoList to true and transfer the last object from drawings' + 
      'to undoList if it is not undefined', () => {
    const drawingsSpy = spyOn(service.drawingStorage.drawings, 'pop');
    const undoListSpy = spyOn(service.undoList, 'push');
    drawingsSpy.and.returnValue(undefined);
    
    service.undo();
    
    expect(service.accessingUndoList).toBe(true);
    // tslint:disable-next-line:no-magic-numbers
    expect(drawingsSpy.calls.count()).toBe(1);
    expect(undoListSpy).not.toHaveBeenCalled();

    service.accessingUndoList = false;
    const dummyDrawing: ITools = {
      id: '',
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    }
    drawingsSpy.and.returnValue(dummyDrawing);
    
    service.undo();
    
    expect(service.accessingUndoList).toBe(true);
    // tslint:disable-next-line:no-magic-numbers
    expect(drawingsSpy.calls.count()).toBe(2);
    expect(undoListSpy).toHaveBeenCalled();
  });

  it('#redo should transfer the last object from undoList ' + 
      'to drawings if it is not undefined', () => {
    const drawingsSpy = spyOn(service.drawingStorage.drawings, 'push');
    const undoListSpy = spyOn(service.undoList, 'pop');
    undoListSpy.and.returnValue(undefined);
    
    service.redo();

    // tslint:disable-next-line:no-magic-numbers
    expect(undoListSpy.calls.count()).toBe(1);
    expect(drawingsSpy).not.toHaveBeenCalled();
    
    const dummyDrawing: ITools = {
      id: '',
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    }

    undoListSpy.and.returnValue(dummyDrawing);
    
    service.redo();
    
    // tslint:disable-next-line:no-magic-numbers
    expect(undoListSpy.calls.count()).toBe(2);
    expect(drawingsSpy).toHaveBeenCalled();
  });

  // it('#saveDrawing should push a drawing into drawings and set accessingundoList ' + 
  //     'to false and empty the undoList if it was true', () => {
  //   const dummyDrawing: ITools = {
  //     id: '',
  //     x: 0,
  //     y: 0,
  //     width: 0,
  //     height: 0,
  //   }
  //   const drawingsSpy = spyOn(service.drawingStorage.drawings, 'push');
  //   service.undoList = [dummyDrawing, dummyDrawing];
  //   service.accessingUndoList = false;
    
  //   service.saveDrawing(dummyDrawing);
  //   // tslint:disable:no-magic-numbers
  //   expect(drawingsSpy.calls.count()).toBe(1);
  //   expect(service.undoList.length).toBe(2);

  //   service.accessingUndoList = true;
  //   service.saveDrawing(dummyDrawing);
  //   expect(drawingsSpy.calls.count()).toBe(2);
  //   expect(service.undoList.length).toBe(0);
  //   // tslint:enable:no-magic-numbers
  // });

});
