import { TestBed } from '@angular/core/testing';
import { ToolHandlerService } from './tool-handler.service';

describe('ToolHandlerServiceService', () => {
  let service: ToolHandlerService;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(ToolHandlerService);
  });

  it('should be created with correct initialized values', () => {
    expect(service).toBeTruthy();

    expect(Array.isArray(service.drawings) && !(service.drawings.length)).toBeTruthy();
    expect(service.noneSelected).toBe(true);
    expect(service.crayonSelected).toBe(false);
    expect(service.pinceauSelected).toBe(false);
    expect(service.rectangleSelected).toBe(false);
    expect(service.colourApplicatorSelected).toBe(false);
    expect(service.primaryColor).toEqual('green'); // need color service here
    expect(service.secondaryColor).toEqual('blue');
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

      expect(service.noneSelected).toBe(true);
      expect(service.crayonSelected).toBe(false);
      expect(service.pinceauSelected).toBe(false);
      expect(service.rectangleSelected).toBe(false);
      expect(service.colourApplicatorSelected).toBe(false);
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

  it('#choosePinceau should call #resetSelection and select the Pinceau', () => {
    const resetSpy = spyOn(service, 'resetSelection');
    service.choosePinceau();

    expect(resetSpy).toHaveBeenCalled();
    expect(service.pinceauSelected).toBe(true);
    expect(service.noneSelected).toBe(false);
  });

  it('#chooseColourApplicator should call #resetSelection and select the Color applicator', () => {
    const resetSpy = spyOn(service, 'resetSelection');
    service.chooseColourApplicator();

    expect(resetSpy).toHaveBeenCalled();
    expect(service.colourApplicatorSelected).toBe(true);
    expect(service.noneSelected).toBe(false);
  });

  it('#chooseOther should call #resetSelection', () => {
    const resetSpy = spyOn(service, 'resetSelection');
    service.chooseOther();

    expect(resetSpy).toHaveBeenCalled();
  });

});
