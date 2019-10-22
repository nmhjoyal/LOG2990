import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
import { AttributesService } from '../../assets/attributes/attributes.service';
import { ToolConstants } from '../../assets/tool-constants';
import { LineComponent } from './line.component';

const STROKEWIDTH = 10;
const INITIALX = 150;
const INITIALY = 200;
const CURSORX = 550;
const CURSORY = 700;
// const CURSOR_MOVE = 300;

describe('LineComponent', () => {
  let component: LineComponent;
  let attrService: AttributesService;
  let fixture: ComponentFixture<LineComponent>;
  const toolServiceMock: jasmine.SpyObj<ToolHandlerService> = jasmine.createSpyObj('ToolHandlerService', ['']);
  const attributesServiceMock: AttributesService = new AttributesService();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserDynamicTestingModule],
      declarations: [LineComponent],
      providers: [
        { provide: ToolHandlerService, useValue: toolServiceMock, },
        { provide: AttributesService, useValue: attributesServiceMock, },
      ],
    })
      .compileComponents();
  }));

  // tslint:disable:no-string-literal
  beforeEach(() => {
    fixture = TestBed.createComponent(LineComponent);
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
    attrService.lineAttributes.wasSaved = false;
    attrService.lineAttributes.savedJunctionMode = ToolConstants.ROUND;
    attrService.lineAttributes.savedTraceMode = ToolConstants.STRAIGHT;
    attrService.lineAttributes.savedStrokeWidth = STROKEWIDTH;

    component.ngOnInit();
    expect(component['stroke'].strokeWidth).toEqual(ToolConstants.DEFAULT_STROKE_WIDTH,
      'no loading of attributes, yet strokeWidth did not take default value');
    expect(component['junctionMode']).toEqual(ToolConstants.POINT_MODE.ROUNDED,
      'no loading of attributes, yet junctionMode did not take correct default value');
    expect(component['traceMode']).toEqual(ToolConstants.TRACE_MODE.STRAIGHT,
      'no loading of attributes, yet traceMode did not take correct default value');
  });

  it('#ngOnInit should load strokewidth and trace mode if there are attributes saved in the service', () => {
    attrService.lineAttributes.wasSaved = true;
    attrService.lineAttributes.savedJunctionMode = ToolConstants.ROUND;
    attrService.lineAttributes.savedTraceMode = ToolConstants.STRAIGHT;
    attrService.lineAttributes.savedStrokeWidth = STROKEWIDTH;

    component.ngOnInit();

    expect(component['stroke'].strokeWidth).toEqual(STROKEWIDTH,
      'loading of attributes, yet strokeWidth did not take saved value');
      expect(component['junctionMode']).toEqual(ToolConstants.POINT_MODE.ROUNDED,
      'loading of attributes, yet traceMode did not take saved value');
      expect(component['traceMode']).toEqual(ToolConstants.TRACE_MODE.STRAIGHT,
      'loading of attributes, yet traceMode did not take correct default value');

  });

  it('#ngOnDestroy should save the current attributes in the rectangleAttributes interface of the service', () => {
    component.ngOnDestroy();
    expect(attrService.lineAttributes.savedStrokeWidth).toEqual(ToolConstants.DEFAULT_STROKE_WIDTH,
      'stroke.strokeWidth was not successfully saved upon destruction');
    expect(attrService.lineAttributes.savedJunctionMode).toEqual(ToolConstants.ROUND,
      'the junctionMode was not successfully saved upon destruction');
    expect(attrService.lineAttributes.savedTraceMode).toEqual(ToolConstants.STRAIGHT,
        'the traceMode was not successfully saved upon destruction');
    expect(attrService.lineAttributes.wasSaved).toBeTruthy('#ngOnDestroy set wasSaved to true');

  });

});
