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
    attrService.lineAttributes.savedStrokeWidth = STROKEWIDTH;

    component.ngOnInit();
    // LINEs 66-67 fail... wrong lycycle hooks used?
    expect(component['stroke'].strokeWidth).toEqual(ToolConstants.DEFAULT_STROKE_WIDTH,
      'no loading of attributes, yet strokeWidth did not take default value');
    expect(component['junctionMode']).toEqual(ToolConstants.ROUND,
      'no loading of attributes, yet traceMode did not take correct default value');
  });

  it('#ngOnInit should load strokewidth and trace mode if there are attributes saved in the service', () => {
    attrService.lineAttributes.wasSaved = true;
    attrService.lineAttributes.savedJunctionMode = ToolConstants.ROUND;
    attrService.lineAttributes.savedStrokeWidth = STROKEWIDTH;

    component.ngOnInit();

    expect(component['stroke'].strokeWidth).toEqual(STROKEWIDTH,
      'loading of attributes, yet strokeWidth did not take saved value');
      expect(component['junctionMode']).toEqual(ToolConstants.ROUND,
      'loading of attributes, yet traceMode did not take saved value');

  });

  it('#ngOnDestroy should save the current attributes in the rectangleAttributes interface of the service', () => {
    component.ngOnDestroy();
    // LINEs 85-86 fail... wrong lifecycle hooks used?
    expect(attrService.lineAttributes.savedStrokeWidth).toEqual(ToolConstants.DEFAULT_STROKE_WIDTH,
      'shape.strokeWidth was not successfully saved upon destruction');
    expect(attrService.lineAttributes.savedJunctionMode).toEqual(ToolConstants.ROUND,
      'the traceMode was not successfully saved upon destruction');
    expect(attrService.lineAttributes.wasSaved).toBeTruthy('#ngOnDestroy set wasSaved to true');

  });
/*
  it('#calculateDimensions should make both the width and height equals to the smallest of the two when shift is pressed', () => {
    component['stroke'].strokeWidth = STROKEWIDTH;

    component.onShiftUp();

    expect(component['stroke'].points).toEqual(component['previewLine'].x2 - STROKEWIDTH, 'x2 unchanged when shift is not pressed');
    expect(component['stroke'].y2).toEqual(component['previewLine'].y2 - STROKEWIDTH, 'y2 unchanged when shift is not pressed');

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
*/
});
