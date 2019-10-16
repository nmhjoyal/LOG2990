import { TestBed } from '@angular/core/testing';

import { ToolHandlerService } from './tool-handler.service';

describe('ToolHandlerService', () => {
  let service: ToolHandlerService;

  beforeEach(() => TestBed.configureTestingModule({}));

  beforeEach( async () => {
     service = TestBed.get(ToolHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call resetSelection when an unimplemented tool is selected', () => {
    const spy = spyOn(service, 'resetSelection');
    service.chooseOther();
    expect(spy).toHaveBeenCalled();
  });

  it('should properly select the paintbrush', () => {
    const spy = spyOn(service, 'resetSelection');
    service.choosePaintbrush();
    expect(spy).toHaveBeenCalled();
    expect(service.paintbrushSelected).toBe(true);
    expect(service.noneSelected).toBe(false);
  });

  it('should properly select the crayon', () => {
    const spy = spyOn(service, 'resetSelection');
    service.chooseCrayon();
    expect(spy).toHaveBeenCalled();
    expect(service.crayonSelected).toBe(true);
    expect(service.noneSelected).toBe(false);
  });

  it('should properly select the rectangle', () => {
    const spy = spyOn(service, 'resetSelection');
    service.chooseRectangle();
    expect(spy).toHaveBeenCalled();
    expect(service.rectangleSelected).toBe(true);
    expect(service.noneSelected).toBe(false);
  });

  it('should properly select the color applicator', () => {
    const primary = '#ffffffff';
    const secondary = '#aaaaaaaa';
    const spy = spyOn(service, 'resetSelection');
    service.chooseColourApplicator(primary, secondary);
    expect(spy).toHaveBeenCalled();
    expect(service.primaryColor).toBe(primary);
    expect(service.secondaryColor).toBe(secondary);
    expect(service.colourApplicatorSelected).toBe(true);
    expect(service.noneSelected).toBe(false);
  });

  it('should properly reset the selection', () => {
    service.resetSelection();
    expect(service.noneSelected).toBe(true);
    expect(service.rectangleSelected).toBe(false);
    expect(service.colourApplicatorSelected).toBe(false);
    expect(service.crayonSelected).toBe(false);
    expect(service.paintbrushSelected).toBe(false);
  });

  it('should reset selection and clear drawings when the page is cleared', () => {
    const spy = spyOn(service, 'resetSelection');
    service.drawings.length = 10;
    service.clearPage();
    expect(spy).toHaveBeenCalled();
    expect(service.drawings.length).toEqual(0);
  });
});
