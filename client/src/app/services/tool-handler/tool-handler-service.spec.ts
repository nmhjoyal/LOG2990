import { TestBed } from '@angular/core/testing';
import { ToolConstants } from 'src/app/drawing-view/components/tools/assets/tool-constants';
import { ColorService } from '../color_service/color.service';
import { ToolHandlerService } from './tool-handler.service';

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
      expect(service.ellipseSelected).toBe(false);
      expect(service.colourApplicatorSelected).toBe(false);
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

  it('#choosePaintbrush should call #resetSelection and select the Paintbrush', () => {
    const resetSpy = spyOn(service, 'resetSelection');
    service.choosePaintbrush();

    expect(resetSpy).toHaveBeenCalled();
    expect(service.paintbrushSelected).toBe(true);
    expect(service.noneSelected).toBe(false);
  });

  it('#chooseColourApplicator should call #resetSelection and select the Color applicator', () => {
    const resetSpy = spyOn(service, 'resetSelection');
    service.chooseColourApplicator(colorService.color[0], colorService.color[1]);

    expect(resetSpy).toHaveBeenCalled();
    expect(service.colourApplicatorSelected).toBe(true);
    expect(service.noneSelected).toBe(false);
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

});
