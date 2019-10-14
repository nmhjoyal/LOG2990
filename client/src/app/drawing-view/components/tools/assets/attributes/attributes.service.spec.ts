import { TestBed } from '@angular/core/testing';
import { AttributesService } from './attributes.service';
import { ToolConstants } from '../tool-constants';


const STROKEWIDTH = 10;


describe('AttributesService', () => {
  let service: AttributesService;
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    service = TestBed.get(AttributesService);
    expect(service).toBeTruthy();
  });

  it('#resetSavedAttributes should set rectangleAttributes back to it\'s initial values if they were changed', () => {
    service = TestBed.get(AttributesService);
    let rectAttr = service.rectangleAttributes;
    const defaultRectAttr = rectAttr;
    
    rectAttr.wasSaved = true;
    rectAttr.savedTraceMode = ToolConstants.TRACE_MODE.FILL;
    rectAttr.savedStrokeWidth = STROKEWIDTH;
    
    service.resetSavedAttributes();

    expect(rectAttr).toEqual(defaultRectAttr, 'rectangleAttributes did not take initial values after the expected reset');

  });

  it('#resetSavedAttributes should not set rectangleAttributes back to it\'s initial values if they were never changed', () => {
    service = TestBed.get(AttributesService);
    let rectAttr = service.rectangleAttributes;
    
    rectAttr.wasSaved = false;
    rectAttr.savedTraceMode = ToolConstants.TRACE_MODE.FILL;
    rectAttr.savedStrokeWidth = STROKEWIDTH;

    const unmodifiedRectAttr = rectAttr;
    
    service.resetSavedAttributes();

    expect(rectAttr).toEqual(unmodifiedRectAttr, 'rectangleAttributes took initial values but wasSaved was false');

  });
});
