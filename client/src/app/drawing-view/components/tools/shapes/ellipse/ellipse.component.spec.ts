import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
import { AttributesService } from '../../assets/attributes/attributes.service';
import { ToolConstants } from '../../assets/tool-constants';
import { EllipseComponent } from './ellipse.component';

const STROKE_WIDTH = 10;
const INITIAL_X = 150;
const INITIAL_Y = 200;
const CURSOR_X = 550;
const CURSOR_Y = 700;
const CURSOR_MOVE = 300;

describe('EllipseComponent', () => {
  let component: EllipseComponent;
  let attrService: AttributesService;
  let fixture: ComponentFixture<EllipseComponent>;
  const toolServiceMock: jasmine.SpyObj<ToolHandlerService> = jasmine.createSpyObj('ToolHandlerService', ['']);
  const attributesServiceMock: AttributesService = new AttributesService();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserDynamicTestingModule],
      declarations: [EllipseComponent],
      providers: [
        { provide: ToolHandlerService, useValue: toolServiceMock, },
        { provide: AttributesService, useValue: attributesServiceMock, },
      ],
    })
      .compileComponents();
  }));

  // tslint:disable:no-string-literal
  beforeEach(() => {
    fixture = TestBed.createComponent(EllipseComponent);
    attrService = TestBed.get(AttributesService); // could use a property spy...
    component = fixture.componentInstance;
    fixture.detectChanges();

    component['initialX'] = INITIAL_X;
    component['initialY'] = INITIAL_Y;
    component['cursorX'] = CURSOR_X;
    component['cursorY'] = CURSOR_Y;
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
    attrService.ellipseAttributes.wasSaved = false;
    attrService.ellipseAttributes.savedTraceMode = ToolConstants.TRACE_MODE.CONTOUR;
    attrService.ellipseAttributes.savedStrokeWidth = STROKE_WIDTH;

    component.ngOnInit();
    expect(component['shape'].strokeWidth).toEqual(ToolConstants.DEFAULT_STROKE_WIDTH,
      'no loading of attributes, yet strokeWidth did not take default value');
    expect(component['traceMode']).toEqual(ToolConstants.TRACE_MODE.CONTOUR_FILL,
      'no loading of attributes, yet traceMode did not take correct default value');
  });

  it('#ngOnInit should load strokewidth and trace mode if there are attributes saved in the service', () => {
    attrService.ellipseAttributes.wasSaved = true;
    attrService.ellipseAttributes.savedTraceMode = ToolConstants.TRACE_MODE.CONTOUR;
    attrService.ellipseAttributes.savedStrokeWidth = STROKE_WIDTH;

    component.ngOnInit();

    expect(component['shape'].strokeWidth).toEqual(STROKE_WIDTH,
      'loading of attributes, yet strokeWidth did not take saved value');
    expect(component['traceMode']).toEqual(ToolConstants.TRACE_MODE.CONTOUR,
      'loading of attributes, yet traceMode did not take saved value');

  });

  it('#ngOnDestroy should save the current attributes in the ellipseAttributes interface of the service', () => {
    component.ngOnDestroy();
    expect(attrService.ellipseAttributes.savedStrokeWidth).toEqual(ToolConstants.DEFAULT_STROKE_WIDTH,
      'shape.strokeWidth was not successfully saved upon destruction');
    expect(attrService.ellipseAttributes.savedTraceMode).toEqual(ToolConstants.TRACE_MODE.CONTOUR_FILL,
      'the traceMode was not successfully saved upon destruction');
    expect(attrService.ellipseAttributes.wasSaved).toBe(true, '#ngOnDestroy did not set wasSaved to true');

  });

  it('#calculateDimensions should make both the width and height equals to the smallest of the two when shift is pressed', () => {
    component['shape'].strokeWidth = STROKE_WIDTH;

    component.onShiftUp();

    // tslint:disable:no-magic-numbers
    expect(component['shape'].width).toEqual((component['previewBox'].width - STROKE_WIDTH) / 2,
    'width unchanged when shift is not pressed');
    expect(component['shape'].height).toEqual((component['previewBox'].height - STROKE_WIDTH) / 2,
    'height unchanged when shift is not pressed');

    component.onShiftDown();

    expect(component['shape'].height).toEqual(component['shape'].width, 'height took widths value');

    component['cursorY'] -= CURSOR_MOVE;
    component.onShiftDown();

    expect(component['shape'].height).toEqual((component['previewBox'].height - STROKE_WIDTH) / 2,
    'height unchanged when it is the smallest value');
    expect(component['shape'].width).toEqual(component['shape'].height, 'width took heights value');

  });

  it('#calculateDimensions should not alter the values of the shapes width and height when shift is released', () => {
    component['shape'].strokeWidth = STROKE_WIDTH;
    component.onShiftDown();

    expect(component['shape'].height).toEqual(component['shape'].width, 'height took widths value');

    component.onShiftUp();

    expect(component['shape'].height === component['shape'].width).toBe(false, 'ERROR: height took widths value');

  });

});
