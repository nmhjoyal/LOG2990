import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
import { AttributesService } from '../../assets/attributes/attributes.service';
import { ToolConstants } from '../../assets/tool-constants';
import { RectangleComponent } from './rectangle.component';

const STROKEWIDTH = 10;
const INITIALX = 150;
const INITIALY = 200;
const CURSORX = 550;
const CURSORY = 700;
const CURSOR_MOVE = 300;

describe('RectangleComponent', () => {
  let component: RectangleComponent;
  let attrService: AttributesService;
  let fixture: ComponentFixture<RectangleComponent>;
  const toolServiceMock: jasmine.SpyObj<ToolHandlerService> = jasmine.createSpyObj('ToolHandlerService', ['']);
  const attributesServiceMock: AttributesService = new AttributesService();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserDynamicTestingModule],
      declarations: [RectangleComponent],
      providers: [
        { provide: ToolHandlerService, useValue: toolServiceMock, },
        { provide: AttributesService, useValue: attributesServiceMock, },
      ],
    })
      .compileComponents();
  }));

  // tslint:disable:no-string-literal
  beforeEach(() => {
    fixture = TestBed.createComponent(RectangleComponent);
    attrService = TestBed.get(AttributesService); // could use a property spy...
    component = fixture.componentInstance;
    fixture.detectChanges();

    component['initialX'] = INITIALX;
    component['initialY'] = INITIALY;
    component['cursorX'] = CURSORX;
    component['cursorY'] = CURSORY;
    component['mouseDown'] = true;

  });

  afterEach(() => {
    fixture.destroy();
    attrService.resetSavedAttributes();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#ngOnInit should not load strokewidth and trace mode if there are no attributes saved in the service', () => {
    attrService.rectangleAttributes.wasSaved = false;
    attrService.rectangleAttributes.savedTraceMode = ToolConstants.TRACE_MODE.CONTOUR;
    attrService.rectangleAttributes.savedStrokeWidth = STROKEWIDTH;

    component.ngOnInit();
    // LINEs 66-67 fail... wrong lycycle hooks used?
    expect(component['shape'].strokeWidth).toEqual(ToolConstants.DEFAULT_STROKE_WIDTH,
      'no loading of attributes, yet strokeWidth did not take default value');
    expect(component['traceMode']).toEqual(ToolConstants.TRACE_MODE.CONTOUR_FILL,
      'no loading of attributes, yet traceMode did not take correct default value');
  });

  it('#ngOnInit should load strokewidth and trace mode if there are attributes saved in the service', () => {
    attrService.rectangleAttributes.wasSaved = true;
    attrService.rectangleAttributes.savedTraceMode = ToolConstants.TRACE_MODE.CONTOUR;
    attrService.rectangleAttributes.savedStrokeWidth = STROKEWIDTH;

    component.ngOnInit();

    expect(component['shape'].strokeWidth).toEqual(STROKEWIDTH,
      'loading of attributes, yet strokeWidth did not take saved value');
    expect(component['traceMode']).toEqual(ToolConstants.TRACE_MODE.CONTOUR,
      'loading of attributes, yet traceMode did not take saved value');

  });

  it('#ngOnDestroy should save the current attributes in the rectangleAttributes interface of the service', () => {
    component.ngOnDestroy();
    // LINEs 85-86 fail... wrong lifecycle hooks used?
    expect(attrService.rectangleAttributes.savedStrokeWidth).toEqual(ToolConstants.DEFAULT_STROKE_WIDTH,
      'shape.strokeWidth was not successfully saved upon destruction');
    expect(attrService.rectangleAttributes.savedTraceMode).toEqual(ToolConstants.TRACE_MODE.CONTOUR_FILL,
      'the traceMode was not successfully saved upon destruction');
    expect(attrService.rectangleAttributes.wasSaved).toBeTruthy('#ngOnDestroy set wasSaved to true');

  });

  it('#calculateDimensions should make both the width and height equals to the smallest of the two when shift is pressed', () => {
    component['shape'].strokeWidth = STROKEWIDTH;

    component.onShiftUp();

    expect(component['shape'].width).toEqual(component['previewBox'].width - STROKEWIDTH, 'width unchanged when shift is not pressed');
    expect(component['shape'].height).toEqual(component['previewBox'].height - STROKEWIDTH, 'height unchanged when shift is not pressed');

    component.onShiftDown();

    expect(component['shape'].height).toEqual(component['shape'].width, 'height took width\'s value');

    component['cursorY'] -= CURSOR_MOVE;
    component.onShiftDown();

    expect(component['shape'].height).toEqual(component['previewBox'].height - STROKEWIDTH,
    'height unchanged when it is the smallest value');
    expect(component['shape'].width).toEqual(component['shape'].height, 'width took height\'s value');

  });

  it('#calculateDimensions should not alter the values of the shape\'s width and height when shift is released', () => {
    component['shape'].strokeWidth = STROKEWIDTH;
    component.onShiftDown();

    expect(component['shape'].height).toEqual(component['shape'].width, 'height took width\'s value');

    component.onShiftUp();

    expect(component['shape'].height === component['shape'].width).toBeFalsy( 'ERROR: height took width\'s value');

  });

});
