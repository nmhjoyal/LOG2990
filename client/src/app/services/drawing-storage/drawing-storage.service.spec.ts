import { TestBed } from '@angular/core/testing';
import { DrawingStorageService } from './drawing-storage.service';
import { ToolConstants } from 'src/app/drawing-view/components/tools/assets/tool-constants';
import { ITools } from 'src/app/drawing-view/components/tools/assets/interfaces/itools';

const FIFTY = 50;
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
    expect(service.selection).toEqual({ x: 0, y: 0, width: 0, height: 0, primaryColor: 'black', secondaryColor: 'black',
    fillOpacity: 0, strokeOpacity: 1, strokeWidth: 1, id: ToolConstants.TOOL_ID.SELECTOR });
  });

  it('#saveDrawing should add the drawing information to the drawings array', () => {
    let callCounter: number = 0;
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

  it('#seeDrawings should return the drawings array', () => {
    const returnedArray: ITools[] = service.seeDrawings();
    expect(returnedArray).toBe(service.drawings);
  });

  it('#emptyDrawings should empty the drawings array', () => {
    service.emptyDrawings();
    expect(service.drawings.length).toEqual(0);
  });

  it('#resetSelectorBox should reset selector property to default data', () => {
    service.selection = { x: FIFTY, y: FIFTY, width: FIFTY, height: FIFTY, primaryColor: 'black', secondaryColor: 'black',
    fillOpacity: 0, strokeOpacity: 1, strokeWidth: 1, id: ToolConstants.TOOL_ID.SELECTOR };
    service.resetSelectorBox();
    expect(service.selection).toEqual({ x: 0, y: 0, width: 0, height: 0, primaryColor: 'black', secondaryColor: 'black',
    fillOpacity: 0, strokeOpacity: 1, strokeWidth: 1, id: ToolConstants.TOOL_ID.SELECTOR });
  });

  it('#saveSelectorBox should set selector property to input data', () => {
    const selection = { x: FIFTY, y: FIFTY, width: FIFTY, height: FIFTY, primaryColor: 'black', secondaryColor: 'black',
    fillOpacity: 0, strokeOpacity: 1, strokeWidth: 1, id: ToolConstants.TOOL_ID.SELECTOR };
    service.saveSelectorBox(selection);
    expect(service.selection).toEqual(selection);
  });

  it('#selectorBoxExists should return false if height or width are 0 and true otherwise', () => {
    expect(service.selectorBoxExists()).toBeFalsy();
    const selection = { x: FIFTY, y: FIFTY, width: FIFTY, height: FIFTY, primaryColor: 'black', secondaryColor: 'black',
    fillOpacity: 0, strokeOpacity: 1, strokeWidth: 1, id: ToolConstants.TOOL_ID.SELECTOR };
    service.saveSelectorBox(selection);
    expect(service.selectorBoxExists()).toBeTruthy();
  });
});
