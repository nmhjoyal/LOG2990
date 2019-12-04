import { TestBed } from '@angular/core/testing';
import { ToolConstants } from '../constants/tool-constants';
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

  it('#resetSavedAttributes should set polygonAttributes back to its initial values if they were changed', () => {
    service = TestBed.get(AttributesService);
    const polygonAttributes = service.polygonAttributes;
    const defaultPolygonAttribute = polygonAttributes;

    polygonAttributes.wasSaved = true;
    polygonAttributes.savedTraceMode = ToolConstants.TRACE_MODE.FILL;
    polygonAttributes.savedStrokeWidth = STROKEWIDTH;
    polygonAttributes.savedVerticesNumber = ToolConstants.MAX_VERTEX_NUMBER;

    service.resetSavedAttributes();

    expect(polygonAttributes).toEqual(defaultPolygonAttribute, 'polygonAttributes did not take initial values after the expected reset');

  });

  it('#resetSavedAttributes should not set polygonAttributes back to its initial values if they were never changed', () => {
    service = TestBed.get(AttributesService);
    const polygonAttributes = service.polygonAttributes;

    polygonAttributes.wasSaved = false;
    polygonAttributes.savedTraceMode = ToolConstants.TRACE_MODE.FILL;
    polygonAttributes.savedStrokeWidth = STROKEWIDTH;
    polygonAttributes.savedVerticesNumber = ToolConstants.MAX_VERTEX_NUMBER;

    const unmodifiedPolygonAttribute = polygonAttributes;

    service.resetSavedAttributes();

    expect(polygonAttributes).toEqual(unmodifiedPolygonAttribute, 'rectangleAttributes took initial values but wasSaved was false');

  });

  it('#resetSavedAttributes should set sprayCanAttributes back to its initial values if they were changed', () => {
    service = TestBed.get(AttributesService);
    const sprayCanAttributes = service.sprayCanAttributes;
    const defaultSprayCanAttribute = sprayCanAttributes;

    sprayCanAttributes.wasSaved = true;
    sprayCanAttributes.savedSprayPerSecond = 0;
    sprayCanAttributes.savedDiameter = 0;

    service.resetSavedAttributes();

    expect(sprayCanAttributes).toEqual(defaultSprayCanAttribute, 'sprayCanAttributes did not take initial values after the expected reset');

  });

  it('#resetSavedAttributes should not set polygonAttributes back to its initial values if they were never changed', () => {
    service = TestBed.get(AttributesService);
    const sprayCanAttributes = service.sprayCanAttributes;

    sprayCanAttributes.wasSaved = true;
    sprayCanAttributes.savedSprayPerSecond = 0;
    sprayCanAttributes.savedDiameter = 0;

    const unmodifiedSprayCanAttributes = sprayCanAttributes;

    service.resetSavedAttributes();

    expect(sprayCanAttributes).toEqual(unmodifiedSprayCanAttributes, 'sprayCanAttributes took initial values but wasSaved was false');

  });

  it('#resetSavedAttributes should set eraserAttributes back to its initial values if they were changed', () => {
    service = TestBed.get(AttributesService);
    const eraserAttributes = service.eraserAttributes;
    const defaultEraserAttribute = eraserAttributes;

    eraserAttributes.wasSaved = true;
    eraserAttributes.size = 0;

    service.resetSavedAttributes();

    expect(eraserAttributes).toEqual(defaultEraserAttribute, 'sprayCanAttributes did not take initial values after the expected reset');

  });

  it('#resetSavedAttributes should not set eraserAttributes back to its initial values if they were never changed', () => {
    service = TestBed.get(AttributesService);
    const eraserAttributes = service.eraserAttributes;

    eraserAttributes.wasSaved = true;
    eraserAttributes.size = 0;

    const unmodifiedEraserAttribute = eraserAttributes;

    service.resetSavedAttributes();

    expect(eraserAttributes).toEqual(unmodifiedEraserAttribute, 'eraserAttributes took initial values but wasSaved was false');

  });
});
