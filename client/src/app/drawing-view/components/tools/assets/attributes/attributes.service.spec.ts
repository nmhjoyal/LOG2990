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

  it('#resetSavedAttributes should set crayonAttributes back to its initial values if they were changed', () => {
    service = TestBed.get(AttributesService);
    const crayonAttribute = service.crayonAttributes;
    const defaultRectAttr = crayonAttribute;

    crayonAttribute.wasSaved = true;
    crayonAttribute.savedStrokeWidth = STROKEWIDTH;
    crayonAttribute.savedFilter = ToolConstants.NONE;


    service.resetSavedAttributes();

    expect(crayonAttribute).toEqual(defaultRectAttr, 'crayonAttribute did not take initial values after the expected reset');

  });
  it('#resetSavedAttributes should set paintbrushAttributes back to its initial values if they were changed', () => {
    service = TestBed.get(AttributesService);
    const paintbrushAttribute = service.paintbrushAttributes;
    const defaultRectAttr = paintbrushAttribute;

    paintbrushAttribute.wasSaved = true;
    paintbrushAttribute.savedStrokeWidth = STROKEWIDTH;
    paintbrushAttribute.savedFilter = ToolConstants.NONE;


    service.resetSavedAttributes();

    expect(paintbrushAttribute).toEqual(defaultRectAttr, 'paintbrushAttributes did not take initial values after the expected reset');

  });

  it('#resetSavedAttributes should not set crayonAttribute back to its initial values if they were never changed', () => {
    service = TestBed.get(AttributesService);
    const crayonAttribute = service.crayonAttributes;

    crayonAttribute.wasSaved = false;
    crayonAttribute.savedStrokeWidth = STROKEWIDTH;
    crayonAttribute.savedFilter = ToolConstants.FILTER_ID.FILTER1;


    const unmodifiedRectAttr = crayonAttribute;

    service.resetSavedAttributes();

    expect(crayonAttribute).toEqual(unmodifiedRectAttr, 'crayonAttribute took initial values but wasSaved was false');

  });

  it('#resetSavedAttributes should not set paintbrushAttributes back to its initial values if they were never changed', () => {
    service = TestBed.get(AttributesService);
    const paintbrushAttribute = service.paintbrushAttributes;

    paintbrushAttribute.wasSaved = false;
    paintbrushAttribute.savedStrokeWidth = STROKEWIDTH;
    paintbrushAttribute.savedFilter = ToolConstants.FILTER_ID.FILTER1;


    const unmodifiedRectAttr = paintbrushAttribute;

    service.resetSavedAttributes();

    expect(paintbrushAttribute).toEqual(unmodifiedRectAttr, 'paintbrushAttribute took initial values but wasSaved was false');

  });
});

