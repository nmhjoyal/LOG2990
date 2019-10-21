import { TestBed } from '@angular/core/testing';
import { ColorService } from '../color_service/color.service';
import { ToolHandlerService } from './tool-handler.service';

describe('ToolHandlerServiceService', () => {
  let service: ToolHandlerService;
  let colorService: ColorService;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(ToolHandlerService);
    colorService = TestBed.get(ColorService);
  });

  it('should be created with correct initialized values', () => {
    expect(service).toBeTruthy();

    expect(Array.isArray(service.drawings) && !(service.drawings.length)).toBeTruthy();
    expect(service.noneSelected).toBe(true);
    expect(service.crayonSelected).toBe(false);
    expect(service.paintbrushSelected).toBe(false);
    expect(service.rectangleSelected).toBe(false);
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
      service.resetSelection();

      expect(service.noneSelected).toBe(true);
      expect(service.crayonSelected).toBe(false);
      expect(service.paintbrushSelected).toBe(false);
      expect(service.rectangleSelected).toBe(false);
      expect(service.lineSelected).toBe(false);
      expect(service.secondaryColorSelected).toBe(false);
      expect(service.primaryColorSelected).toBe(false);
  });

  it('#clearPage should call #resetSelection and empty the drawings array', () => {
    const resetSpy = spyOn(service, 'resetSelection');
    service.clearPage();

    expect(resetSpy).toHaveBeenCalled();
    expect(service.drawings.length).toEqual(0);
  });

  it('#chooseRectangle should call #resetSelection and select the rectangle', () => {
    const resetSpy = spyOn(service, 'resetSelection');
    service.chooseRectangle();

    expect(resetSpy).toHaveBeenCalled();
    expect(service.rectangleSelected).toBe(true);
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

  it('#chooseOther should call #resetSelection', () => {
    const resetSpy = spyOn(service, 'resetSelection');
    service.chooseOther();

    expect(resetSpy).toHaveBeenCalled();
  });

});
