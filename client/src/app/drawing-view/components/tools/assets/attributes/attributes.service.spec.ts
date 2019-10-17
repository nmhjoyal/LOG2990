import { TestBed } from '@angular/core/testing';
import { ToolConstants } from '../tool-constants';
import { AttributesService } from './attributes.service';

const STROKEWIDTH = 10;

describe('AttributesService', () => {
  let service: AttributesService;
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    service = TestBed.get(AttributesService);
    expect(service).toBeTruthy();
  });

  it('#resetSavedAttributes should set rectangleAttributes back to its initial values if they were changed', () => {
    service = TestBed.get(AttributesService);
    const rectangleAttribute = service.rectangleAttributes;
    const defaultRectAttr = rectangleAttribute;

    rectangleAttribute.wasSaved = true;
    rectangleAttribute.savedTraceMode = ToolConstants.TRACE_MODE.FILL;
    rectangleAttribute.savedStrokeWidth = STROKEWIDTH;

    service.resetSavedAttributes();

    expect(rectangleAttribute).toEqual(defaultRectAttr, 'rectangleAttributes did not take initial values after the expected reset');

  });

  it('#resetSavedAttributes should not set rectangleAttributes back to its initial values if they were never changed', () => {
    service = TestBed.get(AttributesService);
    const rectangleAttribute = service.rectangleAttributes;

    rectangleAttribute.wasSaved = false;
    rectangleAttribute.savedTraceMode = ToolConstants.TRACE_MODE.FILL;
    rectangleAttribute.savedStrokeWidth = STROKEWIDTH;

    const unmodifiedRectAttr = rectangleAttribute;

    service.resetSavedAttributes();

    expect(rectangleAttribute).toEqual(unmodifiedRectAttr, 'rectangleAttributes took initial values but wasSaved was false');

  });
});
