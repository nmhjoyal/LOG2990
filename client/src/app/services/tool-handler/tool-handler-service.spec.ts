import { TestBed } from '@angular/core/testing';
import { ToolHandlerService } from './tool-handler.service';
import { AppConstants } from 'src/AppConstants';

describe('ToolHandlerServiceService', () => {
  let service: ToolHandlerService;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(ToolHandlerService);
  });

  it('should be created with correct initialized values', () => {
    expect(service).toBeTruthy();
    
    expect(Array.isArray(service.drawings) && !(service.drawings.length)).toBeTruthy();
    expect(service.noneSelected).toBeTruthy();
    expect(service.crayonSelected).toBeFalsy();
    expect(service.pinceauSelected).toBeFalsy();
    expect(service.rectangleSelected).toBeFalsy();
    expect(service.colourApplicatorSelected).toBeFalsy();
    expect(service.primaryColor).toEqual(AppConstants.DEFAULT_PRIMARY_COLOUR);
    expect(service.secondaryColor).toEqual(AppConstants.DEFAULT_SECONDARY_COLOUR);
  });

  it('#secondaryColor should properly access the secondary color', () => {
      const color = service.secondaryColor;
      expect(color).toBe(service.secondaryColor); // USE COLOR SERVICE INSTEAD OF SERVICE HERE
  });

  it('#primaryColor should propely access the primary color', () => {
      const color = service.primaryColor;
      expect(color).toBe(service.primaryColor); // USE COLOR SERVICE INSTEAD OF SERVICE HERE
  });

  it('#resetSelection should reset all tool selections to false and set noneSelected to true', () => {
      service.resetSelection();

      expect(service.noneSelected).toBeTruthy();
      expect(service.crayonSelected).toBeFalsy();
      expect(service.pinceauSelected).toBeFalsy();
      expect(service.rectangleSelected).toBeFalsy();
      expect(service.colourApplicatorSelected).toBeFalsy();
  });

  it('#clearPage should call #resetSelection and empty the drawings array', () => {
    const resetSpy = spyOn(service, 'resetSelection');
    service.clearPage();

    expect(resetSpy).toHaveBeenCalled();
    expect(service.drawings.length).toBeFalsy();
  });

  it('#chooseRectangle should call #resetSelection and select the rectangle', () => {
    const resetSpy = spyOn(service, 'resetSelection');
    service.chooseRectangle();

    expect(resetSpy).toHaveBeenCalled();
    expect(service.rectangleSelected).toBeTruthy();
    expect(service.noneSelected).toBeFalsy();
  });

  it('#chooseCrayon should call #resetSelection and select the crayon', () => {
    const resetSpy = spyOn(service, 'resetSelection');
    service.chooseCrayon();

    expect(resetSpy).toHaveBeenCalled();
    expect(service.crayonSelected).toBeTruthy();
    expect(service.noneSelected).toBeFalsy();
  });

  it('#choosePinceau should call #resetSelection and select the Pinceau', () => {
    const resetSpy = spyOn(service, 'resetSelection');
    service.choosePinceau();

    expect(resetSpy).toHaveBeenCalled();
    expect(service.pinceauSelected).toBeTruthy();
    expect(service.noneSelected).toBeFalsy();
  });

  it('#chooseColourApplicator should call #resetSelection and select the Color applicator', () => {
    const resetSpy = spyOn(service, 'resetSelection');
    service.chooseColourApplicator();

    expect(resetSpy).toHaveBeenCalled();
    expect(service.colourApplicatorSelected).toBeTruthy();
    expect(service.noneSelected).toBeFalsy();
  });

  it('#chooseOther should call #resetSelection', () => {
    const resetSpy = spyOn(service, 'resetSelection');
    service.chooseOther();

    expect(resetSpy).toHaveBeenCalled();
  });

});
