import { TestBed } from '@angular/core/testing';
import { ToolConstants } from 'src/app/drawing-view/components/tools/assets/constants/tool-constants';
import { Strings } from 'src/AppConstants/Strings';
import { ColorService } from '../color_service/color.service';
import { ToolHandlerService } from './tool-handler.service';
import { ITools } from 'src/app/drawing-view/components/tools/assets/interfaces/itools';

describe('ToolHandlerService', () => {
  let service: ToolHandlerService;
  let colorService: ColorService;
  const FIFTY = 50;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(ToolHandlerService);
    colorService = TestBed.get(ColorService);
  });

  it('should be created with correct initialized values', () => {
    expect(service).toBeTruthy();

    expect(Array.isArray(service.drawings) && !(service.drawings.length)).toBeTruthy();
    expect(service.selection).toEqual({ x: 0, y: 0, width: 0, height: 0, primaryColor: 'black', secondaryColor: 'black',
    fillOpacity: 0, strokeOpacity: 1, strokeWidth: 1, id: ToolConstants.TOOL_ID.SELECTOR });
    expect(service.noneSelected).toBe(true);
    expect(service.crayonSelected).toBe(false);
    expect(service.paintbrushSelected).toBe(false);
    expect(service.rectangleSelected).toBe(false);
    expect(service.ellipseSelected).toBe(false);
    expect(service.colourApplicatorSelected).toBe(false);
    expect(service.polygonSelected).toBe(false);
    expect(service.selectorSelected).toBe(false);
    expect(service.primaryColor).toEqual(colorService.color[0]);
    expect(service.secondaryColor).toEqual(colorService.color[1]);
  });

  it('#secondaryColor should properly access the secondary color', () => {
      const color = colorService.color[1];
      expect(color).toBe( colorService.color[1]);
  });

  it('#primaryColor should propely access the primary color', () => {
      const color = colorService.color[0];
      expect(color).toBe( colorService.color[0]);
  });

  it('#resetSelection should reset all tool selections to false and set noneSelected to true', () => {
      spyOn(service, 'resetSelectorBox').and.callThrough();
      service.resetSelection();

      expect(service.noneSelected).toBe(true);
      expect(service.crayonSelected).toBe(false);
      expect(service.paintbrushSelected).toBe(false);
      expect(service.rectangleSelected).toBe(false);
      expect(service.lineSelected).toBe(false);
      expect(service.secondaryColorSelected).toBe(false);
      expect(service.primaryColorSelected).toBe(false);
      expect(service.ellipseSelected).toBe(false);
      expect(service.colourApplicatorSelected).toBe(false);
      expect(service.polygonSelected).toBe(false);
      expect(service.selectorSelected).toBe(false);
      expect(service.resetSelectorBox).toHaveBeenCalled();
  });

  it('#clearPage should call #resetSelection and empty the drawings array', () => {
    const resetSpy = spyOn(service, 'resetSelection');
    service.clearPage();

    expect(resetSpy).toHaveBeenCalled();
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

  it('#chooseRectangle should call #resetSelection and select the rectangle', () => {
    const resetSpy = spyOn(service, 'resetSelection');
    service.chooseRectangle();

    expect(resetSpy).toHaveBeenCalled();
    expect(service.rectangleSelected).toBe(true);
    expect(service.noneSelected).toBe(false);
  });

  it('#chooseEllipse should call #resetSelection and select the ellipse', () => {
    const resetSpy = spyOn(service, 'resetSelection');
    service.chooseEllipse();

    expect(resetSpy).toHaveBeenCalled();
    expect(service.ellipseSelected).toBe(true);
    expect(service.noneSelected).toBe(false);
  });

  it('#chooseCrayon should call #resetSelection and select the crayon', () => {
    const resetSpy = spyOn(service, 'resetSelection');
    service.chooseCrayon();

    expect(resetSpy).toHaveBeenCalled();
    expect(service.crayonSelected).toBe(true);
    expect(service.noneSelected).toBe(false);
  });

  it('#chooseLine should call #resetSelection and select the crayon', () => {
    const resetSpy = spyOn(service, 'resetSelection');
    service.chooseLine();

    expect(resetSpy).toHaveBeenCalled();
    expect(service.lineSelected).toBe(true);
    expect(service.noneSelected).toBe(false);
  });

  it('#choosePaintbrush should call #resetSelection and select the Paintbrush', () => {
    const resetSpy = spyOn(service, 'resetSelection');
    service.choosePaintbrush();

    expect(resetSpy).toHaveBeenCalled();
    expect(service.paintbrushSelected).toBe(true);
    expect(service.noneSelected).toBe(false);
  });

  it('#choosePrimaryColor should call #resetSelection and select the PrimaryColor', () => {
    const resetSpy = spyOn(service, 'resetSelection');
    service.choosePrimaryColor();

    expect(resetSpy).toHaveBeenCalled();
    expect(service.primaryColorSelected).toBe(true);
    expect(service.noneSelected).toBe(false);
  });

  it('#chooseSecondaryColor should call #resetSelection and select the SecondaryColor', () => {
    const resetSpy = spyOn(service, 'resetSelection');
    service.chooseSecondaryColor();

    expect(resetSpy).toHaveBeenCalled();
    expect(service.secondaryColorSelected).toBe(true);
    expect(service.noneSelected).toBe(false);
  });

  it('#choosePolygon should call #resetSelection and select the polygon', () => {
    const resetSpy = spyOn(service, 'resetSelection');
    service.choosePolygon();

    expect(resetSpy).toHaveBeenCalled();
    expect(service.polygonSelected).toBe(true);
  });

  it('#chooseEyedropper should call #resetSelection and select the ipette', () => {
    const resetSpy = spyOn(service, 'resetSelection');
    service.chooseEyedropper();

    expect(resetSpy).toHaveBeenCalled();
    expect(service.pipetteSelected).toBe(true);
  });

  it('#chooseSelector should call #resetSelection and select the Selector', () => {
    const resetSpy = spyOn(service, 'resetSelection');
    service.chooseSelector();

    expect(resetSpy).toHaveBeenCalled();
    expect(service.selectorSelected).toBe(true);
    expect(service.noneSelected).toBe(false);
  });

  it('#chooseOther should call #resetSelection', () => {
    const resetSpy = spyOn(service, 'resetSelection');
    service.chooseOther();

    expect(resetSpy).toHaveBeenCalled();
  });

  it('#undo should set accessingUndoList to true and transfer the last object from drawings' + 
      'to undoList if it is not undefined', () => {
    const drawingsSpy = spyOn(service.drawings, 'pop');
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
    const drawingsSpy = spyOn(service.drawings, 'push');
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

  it('#saveDrawing should push a drawing into drawings and set accessingundoList ' + 
      'to false and empty the undoList if it was true', () => {
    const dummyDrawing: ITools = {
      id: '',
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    }
    const drawingsSpy = spyOn(service.drawings, 'push');
    service.undoList = [dummyDrawing, dummyDrawing];
    service.accessingUndoList = false;
    
    service.saveDrawing(dummyDrawing);
    // tslint:disable:no-magic-numbers
    expect(drawingsSpy.calls.count()).toBe(1);
    expect(service.undoList.length).toBe(2);

    service.accessingUndoList = true;
    service.saveDrawing(dummyDrawing);
    expect(drawingsSpy.calls.count()).toBe(2);
    expect(service.undoList.length).toBe(0);
    // tslint:enable:no-magic-numbers
  });
  
  it('#chooseStamp should call #resetSelection', () => {
    const resetSpy = spyOn(service, 'resetSelection');
    service.chooseStamp();

    expect(resetSpy).toHaveBeenCalled();
  });

  it('#chooseColourApplicator should call #resetSelection', () => {
    const resetSpy = spyOn(service, 'resetSelection');
    service.chooseColourApplicator(Strings.WHITE_HEX, Strings.BLACK_HEX);
    expect(service.primaryColor).toEqual(Strings.WHITE_HEX);
    expect(service.secondaryColor).toEqual(Strings.BLACK_HEX);
    expect(resetSpy).toHaveBeenCalled();
    expect(service.colourApplicatorSelected).toBe(true);
    expect(service.noneSelected).toBe(false);
  });

  it('#chooseText should call #resetSelection', () => {
    const resetSpy = spyOn(service, 'resetSelection');
    service.chooseText();

    expect(resetSpy).toHaveBeenCalled();
  });
});
