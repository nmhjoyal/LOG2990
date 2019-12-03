import { TestBed } from '@angular/core/testing';
import { ITools } from 'src/app/drawing-view/components/tools/assets/interfaces/itools';
import { DrawingStorageService } from './drawing-storage.service';

const LOOP_ITERATIONS = 3;

describe('DrawingStorageService', () => {
  let service: DrawingStorageService;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(DrawingStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();

    expect(Array.isArray(service.drawings) && !(service.drawings.length)).toBeTruthy();
  });

  it('#saveDrawing should add the drawing information to the drawings array', () => {
    let callCounter = 0;
    const myDrawing: ITools = {
      id: '',
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    };
    for (let index = 0; index < LOOP_ITERATIONS; index++) {
      myDrawing.id = 'the Id ' + index;
      service.saveDrawing(myDrawing);
      callCounter++;
      expect(service.drawings.length).toBe(callCounter);
      expect(service.drawings[index].id).toEqual('the Id ' + index);
    }
  });

  it('#emptyDrawings should empty the drawings array', () => {
    service.emptyDrawings();
    expect(service.drawings.length).toEqual(0);
  });

  it('#isEmpty should return true or false depending on weather or not the drawings array is empty', () => {
    const myDrawing: ITools = {
      id: '',
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    };
    service.drawings = [myDrawing, myDrawing, myDrawing];
    expect(service.isEmpty()).toBe(false);

    service.drawings = [];
    expect(service.isEmpty()).toBe(true);
  });

});
