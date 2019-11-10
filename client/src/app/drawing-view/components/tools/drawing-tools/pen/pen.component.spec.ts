import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import ClickHelper from 'src/app/helpers/click-helper/click-helper';
import { ColorService } from 'src/app/services/color_service/color.service';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
import { AttributesService } from '../../assets/attributes/attributes.service';
import { ToolConstants } from '../../assets/tool-constants';
import { PenComponent } from './pen.component';

const MIN_STROKE_WIDTH = 3;
const MAX_STROKE_WIDTH = 9;

describe('StyloComponent', () => {
  let penComponent: PenComponent;
  let attrService: AttributesService;
  let fixture: ComponentFixture<PenComponent>;
  const toolServiceMock: ToolHandlerService = new ToolHandlerService(new ColorService());
  const attributesServiceMock: AttributesService = new AttributesService();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PenComponent],
      imports: [BrowserAnimationsModule],
      providers: [
        { provide: ToolHandlerService, useValue: toolServiceMock, },
        { provide: AttributesService, useValue: attributesServiceMock, },
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PenComponent);
    attrService = TestBed.get(AttributesService);
    penComponent = fixture.componentInstance;
    toolServiceMock.drawings = [];
  });

  afterEach(() => {
    fixture.destroy();
    attrService.resetSavedAttributes();
  });

  it('should create', () => {
    expect(penComponent).toBeTruthy();
  });

  it('should save the attribute when the component is destroyed', () => {
    const spy = spyOn(penComponent, 'saveAttribute');
    penComponent.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
  });

  it('should properly save the attributes', () => {
    penComponent.ngOnDestroy();
    expect(attrService.penAttributes.savedMinWidth).toEqual(ToolConstants.DEFAULT_MIN_WIDTH,
      'stroke.strokeWidth was not successfully saved upon destruction');
    expect(attrService.penAttributes.savedMaxWidth).toEqual(ToolConstants.DEFAULT_MAX_WIDTH,
      'stroke.strokeWidth was not successfully saved upon destruction');
    expect(attrService.penAttributes.wasSaved).toBe(true, '#ngOnDestroy did not set wasSaved to true');
  });

  it('#ngOnInit should not load strokewidth and filter if there are no attributes saved in the service', () => {
    attrService.penAttributes.wasSaved = false;
    attrService.penAttributes.savedMaxWidth = MAX_STROKE_WIDTH;
    attrService.penAttributes.savedMinWidth = MIN_STROKE_WIDTH;
    penComponent.ngOnInit();
    expect(penComponent.minWidth).toEqual(ToolConstants.DEFAULT_MIN_WIDTH,
      'no loading of attributes, yet minWidth did not take default value');
    expect(penComponent.maxWidth).toEqual(ToolConstants.DEFAULT_MAX_WIDTH,
      'no loading of attributes, yet maxWidth did not take default value');
  });

  it('#ngOnInit should load strokewidth and filter if there are attributes saved in the service', () => {
    attrService.penAttributes.wasSaved = true;
    attrService.penAttributes.savedMaxWidth = MAX_STROKE_WIDTH;
    attrService.penAttributes.savedMinWidth = MIN_STROKE_WIDTH;
    penComponent.ngOnInit();
    expect(penComponent.minWidth).toEqual(MIN_STROKE_WIDTH,
      'loading of attributes, yet minWidth did not take saved value');
    expect(penComponent.maxWidth).toEqual(MAX_STROKE_WIDTH,
      'loading of attributes, yet maxWidth did not take saved value');
  });

  it('should properly calculate speed between two points', () => {
    penComponent.lastX = 1;
    penComponent.lastY = 1;
    const pointB = [2, 2];
    penComponent.lastTime = 1;
    const timeB = 2;
    // tslint:disable: no-any
    const result = (penComponent as any).calculateSpeed(pointB[0], pointB[1], timeB);
    expect(result).toEqual(Math.sqrt(2));
  });

  it('#onMouseDown should initialize first point and stroke attributes', () => {
    spyOn(ClickHelper, 'getXPosition').and.returnValue(1);
    spyOn(ClickHelper, 'getYPosition').and.returnValue(1);
    const event = new MouseEvent('mousedown');
    fixture.debugElement.triggerEventHandler('mousedown', event);
    expect(penComponent.lastX).toEqual(1);
    expect(penComponent.lastY).toEqual(1);
    expect(penComponent.pen.x).toEqual(penComponent.lastX);
    expect(penComponent.pen.y).toEqual(penComponent.lastY);
    expect(penComponent.pen.width).toEqual(0);
    expect(penComponent.pen.height).toEqual(0);
  });

  it('#onMouseMove should add paths with decrementing width', () => {
    const xPosSpy = spyOn(ClickHelper, 'getXPosition');
    const yPosSpy = spyOn(ClickHelper, 'getYPosition');
    xPosSpy.and.returnValue(0);
    yPosSpy.and.returnValue(0);
    penComponent.lastY = 0;
    const mousedown = new MouseEvent('mousedown');
    fixture.debugElement.triggerEventHandler('mousedown', mousedown);
    penComponent.minWidth = MIN_STROKE_WIDTH;
    penComponent.maxWidth = MAX_STROKE_WIDTH;
    xPosSpy.and.returnValue(1);
    yPosSpy.and.returnValue(1);
    // tslint:disable: no-magic-numbers
    const speedSpy = spyOn<any>(penComponent, 'calculateSpeed');
    speedSpy.and.returnValue(0.3);
    const event = new MouseEvent('mousemove');
    penComponent.newWidth = penComponent.maxWidth;
    fixture.debugElement.triggerEventHandler('mousemove', event);
    expect(penComponent.speed).toEqual(0.3);
    expect(penComponent.newWidth).toEqual(MAX_STROKE_WIDTH - ToolConstants.STROKE_INCREMENT);
    penComponent.newWidth = penComponent.minWidth;
    fixture.debugElement.triggerEventHandler('mousemove', event);
    // Does not increment if already at min width
    expect(penComponent.newWidth).toEqual(MIN_STROKE_WIDTH);
    // Does not change width if position hasn't changed
    penComponent.newWidth = 1;
    penComponent.lastY = 0;
    penComponent.lastX = 0;
    fixture.debugElement.triggerEventHandler('mousemove', event);
    expect(penComponent.newWidth).toEqual(1);
  });

  it('#onMouseMove should add paths with incrementing width', () => {
    const xPosSpy = spyOn(ClickHelper, 'getXPosition');
    const yPosSpy = spyOn(ClickHelper, 'getYPosition');
    xPosSpy.and.returnValue(0);
    yPosSpy.and.returnValue(0);
    const mousedown = new MouseEvent('mousedown');
    fixture.debugElement.triggerEventHandler('mousedown', mousedown);
    penComponent.minWidth = MIN_STROKE_WIDTH;
    penComponent.maxWidth = MAX_STROKE_WIDTH;
    xPosSpy.and.returnValue(1);
    yPosSpy.and.returnValue(1);
    const speedSpy = spyOn<any>(penComponent, 'calculateSpeed');
    speedSpy.and.returnValue(0.0008);
    const event = new MouseEvent('mousemove');
    penComponent.newWidth = penComponent.minWidth;
    fixture.debugElement.triggerEventHandler('mousemove', event);
    expect(penComponent.speed).toEqual(0.0008);
    expect(penComponent.newWidth).toEqual(MIN_STROKE_WIDTH + ToolConstants.STROKE_INCREMENT);
    penComponent.newWidth = penComponent.maxWidth;
    penComponent.lastX = 0;
    fixture.debugElement.triggerEventHandler('mousemove', event);
    // Does not decrement if already at max width
    expect(penComponent.newWidth).toEqual(MAX_STROKE_WIDTH);
  });

  it('#onMouseUp should save stroke and reset paths, following #onMouseMove should not draw', () => {
    penComponent.pen = {
      id: ToolConstants.TOOL_ID.PEN,
      paths: [{ path: 'M1,2L2,3', pathWidth: 2 }, { path: 'M2,3L3,4', pathWidth: 3 }],
      colour: 'black',
      strokeLinecap: ToolConstants.ROUND,
      x: 0,
      y: 0,
      width: 2,
      height: 2,
    };
    expect(toolServiceMock.drawings.length).toEqual(0);
    penComponent.onMouseUp();
    expect(toolServiceMock.drawings.length).toEqual(1);
    expect(penComponent.pen.paths.length).toEqual(0);
    penComponent.onMouseMove(new MouseEvent('mousemove'));
    expect(penComponent.pen.paths.length).toEqual(0);
  });

  it('should increment/decrement minWidth when increase/decreaseMinWidth called', () => {
      expect(penComponent.minWidth).toEqual(ToolConstants.DEFAULT_MIN_WIDTH);
      (penComponent as any).increaseMinWidth();
      expect(penComponent.minWidth).toEqual(ToolConstants.DEFAULT_MIN_WIDTH + 1);
      penComponent.minWidth = penComponent.maxWidth;
      (penComponent as any).increaseMinWidth();
      expect(penComponent.minWidth).toEqual(penComponent.maxWidth);
      (penComponent as any).decreaseMinWidth();
      expect(penComponent.minWidth).toEqual(ToolConstants.DEFAULT_MAX_WIDTH - 1);
      penComponent.minWidth = 1;
      (penComponent as any).decreaseMinWidth();
      expect(penComponent.minWidth).toEqual(1);
  });

  it('should increment/decrement maxWidth when increase/decreaseMaxWidth called', () => {
    expect(penComponent.maxWidth).toEqual(ToolConstants.DEFAULT_MAX_WIDTH);
    (penComponent as any).decreaseMaxWidth();
    expect(penComponent.maxWidth).toEqual(ToolConstants.DEFAULT_MAX_WIDTH - 1);
    penComponent.maxWidth = penComponent.minWidth;
    (penComponent as any).decreaseMaxWidth();
    expect(penComponent.maxWidth).toEqual(ToolConstants.DEFAULT_MIN_WIDTH);
    (penComponent as any).increaseMaxWidth();
    expect(penComponent.maxWidth).toEqual(ToolConstants.DEFAULT_MIN_WIDTH + 1);
    penComponent.maxWidth = ToolConstants.MAX_STROKE_WIDTH;
    (penComponent as any).increaseMaxWidth();
    expect(penComponent.maxWidth).toEqual(ToolConstants.MAX_STROKE_WIDTH);
  });

  it('should update the position and dimensions of pen component', () => {
    penComponent.pen.x = 1;
    penComponent.pen.y = 1;
    penComponent.pen.width = 1;
    penComponent.pen.height = 1;
    (penComponent as any).updatePositionAndDimensions(0, 0);
    expect(penComponent.pen.x).toEqual(0);
    expect(penComponent.pen.y).toEqual(0);
    (penComponent as any).updatePositionAndDimensions(1, 1);
    expect(penComponent.pen.x).toEqual(0);
    expect(penComponent.pen.y).toEqual(0);
    (penComponent as any).updatePositionAndDimensions(2, 2);
    expect(penComponent.pen.width).toEqual(2);
    expect(penComponent.pen.height).toEqual(2);
    (penComponent as any).updatePositionAndDimensions(0, 0);
    expect(penComponent.pen.width).toEqual(2);
    expect(penComponent.pen.height).toEqual(2);
    // tslint:enable: no-any
    // tslint:enable: no-magic-numbers
  });

});
