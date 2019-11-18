// tslint:disable:no-string-literal
// tslint:disable:no-magic-numbers
// tslint:disable:no-any

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DrawingStorageService } from 'src/app/services/drawing-storage/drawing-storage.service';
import { SaveService } from 'src/app/services/save-service/save.service';
import { AttributesService } from '../../assets/attributes/attributes.service';
import { StampConstants, ToolConstants } from '../../assets/constants/tool-constants';
import { PlumeComponent } from './plume.component';

const ANGLE = 45;
const LINE_LENGTH = 5;
const DELTA_VALUE = 20;
const LAST_X = 10;
const LAST_Y = 20;
const NEW_X = 100;
const NEW_Y = 200;
const DEGREE_TO_RAD = (Math.PI / 180);
const BELOW_RANGE_ANGLE = -180;
const ABOVE_RANGE_ANGLE = 720;

describe('PlumeComponent', () => {
  let plumeComponent: PlumeComponent;
  let attrService: AttributesService;
  let fixture: ComponentFixture<PlumeComponent>;
  const drawingServiceMock: DrawingStorageService = new DrawingStorageService();
  const attributesServiceMock: AttributesService = new AttributesService();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PlumeComponent],
      imports: [BrowserAnimationsModule],
      providers: [
        SaveService,
        { provide: DrawingStorageService, useValue: drawingServiceMock, },
        { provide: AttributesService, useValue: attributesServiceMock, },
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlumeComponent);
    attrService = TestBed.get(AttributesService);
    plumeComponent = fixture.componentInstance;
    drawingServiceMock.emptyDrawings();
  });

  afterEach(() => {
    fixture.destroy();
    attrService.resetSavedAttributes();
  });

  it('should create', () => {
    expect(plumeComponent).toBeTruthy();
  });

  it('should save the attribute when the component is destroyed', () => {
    const spy = spyOn(plumeComponent, 'saveAttribute');
    plumeComponent.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
  });

  it('should properly save the attributes', () => {
    plumeComponent.ngOnDestroy();
    expect(attrService.plumeAttributes.savedLineLength).toEqual(ToolConstants.DEFAULT_LINE_LENGTH,
      'stroke.strokeWidth was not successfully saved upon destruction');
    expect(attrService.plumeAttributes.savedAngle).toEqual(ToolConstants.DEFAULT_ANGLE,
      'stroke.strokeWidth was not successfully saved upon destruction');
    expect(attrService.plumeAttributes.wasSaved).toBe(true, '#ngOnDestroy did not set wasSaved to true');
  });

  it('#ngOnInit should not load angle and line length if there are no attributes saved in the service', () => {
    attrService.plumeAttributes.wasSaved = false;
    attrService.plumeAttributes.savedLineLength = LINE_LENGTH;
    attrService.plumeAttributes.savedAngle = ANGLE;
    plumeComponent.ngOnInit();
    expect(plumeComponent['lineLength']).toEqual(ToolConstants.DEFAULT_LINE_LENGTH,
      'no loading of attributes, yet minWidth did not take default value');
    expect(plumeComponent['angle']).toEqual(ToolConstants.DEFAULT_ANGLE,
      'no loading of attributes, yet maxWidth did not take default value');
  });

  it('#ngOnInit should load angle and line length if there are attributes saved in the service', () => {
    attrService.plumeAttributes.wasSaved = true;
    attrService.plumeAttributes.savedLineLength = LINE_LENGTH;
    attrService.plumeAttributes.savedAngle = ANGLE;
    plumeComponent.ngOnInit();
    expect(plumeComponent['lineLength']).toEqual(LINE_LENGTH,
      'loading of attributes, yet minWidth did not take saved value');
    expect(plumeComponent['angle']).toEqual(ANGLE,
      'loading of attributes, yet maxWidth did not take saved value');
  });

  it('#calculatePath should call fillGaps if the distance is greater than the stroke-width of the line', () => {
    const spy = spyOn<any>(plumeComponent, 'fillGaps');

    plumeComponent['lastX'] = LAST_X;
    plumeComponent['lastY'] = LAST_Y;
    plumeComponent['calculatePath'](LAST_X, LAST_Y);
    expect(spy).not.toHaveBeenCalled();

    plumeComponent['lastX'] = LAST_X;
    plumeComponent['lastY'] = LAST_Y;
    plumeComponent['calculatePath'](NEW_X, NEW_Y);
    expect(spy).toHaveBeenCalled();
  });

  it('#fill gaps should call addPath', () => {
    const spy = spyOn<any>(plumeComponent, 'addPath');
    plumeComponent['fillGaps'](3, 4, 5);
    expect(spy).toHaveBeenCalled();
  });

  it('#onMouseUp should call drawingStorage.saveDrawing', () => {
    const spy = spyOn(plumeComponent['drawingStorage'], 'saveDrawing');
    const mouseEvent: MouseEvent = new MouseEvent('mousedown');
    plumeComponent.onMouseUp(mouseEvent);
    expect(spy).toHaveBeenCalled();
  });

  it('#onMouseMove should change the values of lastX and lastY if mouseDown is true', () => {
    const mouseEvent: MouseEvent = new MouseEvent('mousedown');
    plumeComponent['lastX'] = 0;
    plumeComponent['lastY'] = 0;

    plumeComponent['mouseDown'] = false;
    plumeComponent.onMouseMove(mouseEvent);
    expect(plumeComponent['lastX']).toBe(0);
    expect(plumeComponent['lastY']).toBe(0);

    plumeComponent['mouseDown'] = true;
    plumeComponent.onMouseMove(mouseEvent);
    expect(plumeComponent['lastX']).toEqual(mouseEvent.offsetX);
    expect(plumeComponent['lastY']).toEqual(mouseEvent.offsetY);
  });

  it('#OnWheel should be called when the wheel of the mouse is turned', () => {
    const onWheelSpy = spyOn(plumeComponent, 'onWheel');
    const wheelEvent: WheelEvent = new WheelEvent('wheel');
    fixture.debugElement.triggerEventHandler('wheel', wheelEvent);
    expect(onWheelSpy).toHaveBeenCalled();
  });

  it('#OnWheel should add or substract angleIncrement to angle depending on the direction in which the wheel is turned', () => {
    const wheelInit: WheelEventInit = {
      deltaX: 0.0,
      deltaY: DELTA_VALUE,
      deltaZ: 0.0,
      deltaMode: 0,
    };
    let wheelEvent: WheelEvent = new WheelEvent('wheel', wheelInit);

    plumeComponent['angle'] = ANGLE;
    plumeComponent.onWheel(wheelEvent);
    expect(plumeComponent['angle']).toBe(ANGLE + plumeComponent['angleIncrement']);

    wheelInit.deltaY = - DELTA_VALUE;
    wheelEvent = new WheelEvent('wheel', wheelInit);
    plumeComponent['angle'] = ANGLE;
    plumeComponent.onWheel(wheelEvent);
    expect(plumeComponent['angle']).toBe(ANGLE - plumeComponent['angleIncrement']);
  });

  it('#OnKeyDownAltEvent should be called when the ALT key is pressed', () => {
    const onAltSpy = spyOn(plumeComponent, 'onKeyDownAlt');
    const keyDownEvent: KeyboardEvent = new KeyboardEvent('keydown.alt');
    fixture.debugElement.triggerEventHandler('keydown.alt', keyDownEvent);
    expect(onAltSpy).toHaveBeenCalled();
  });

  it('#OnKeyDownAltEvent should toggle the angleIncrement value', () => {
    plumeComponent['angleIncrement'] = StampConstants.ANGLE_INCREMENT_1;
    plumeComponent.onKeyDownAlt();
    expect(plumeComponent['angleIncrement']).toBe(StampConstants.ANGLE_INCREMENT_15);

    plumeComponent.onKeyDownAlt();
    expect(plumeComponent['angleIncrement']).toBe(StampConstants.ANGLE_INCREMENT_1);
  });

  it('#increaseAngle should increment the value of angle', () => {
    plumeComponent['angle'] = ANGLE;
    plumeComponent.increaseAngle(StampConstants.ANGLE_INCREMENT_1);
    expect(plumeComponent['angle']).toBe(ANGLE + 1);
  });

  it('#decreaseAngle should decrement the value of angle', () => {
    plumeComponent['angle'] = ANGLE;
    plumeComponent.decreaseAngle(StampConstants.ANGLE_INCREMENT_1);
    expect(plumeComponent['angle']).toBe(ANGLE - 1);
  });

  it('#increaseLineLength should increment the value of lineLength', () => {
    plumeComponent['lineLength'] = LINE_LENGTH;
    plumeComponent.increaseLineLength();
    expect(plumeComponent['lineLength']).toBe(LINE_LENGTH + 1);
  });

  it('#decreaseLineLength should decrement the value of lineLength if it is bigger than 0', () => {
    plumeComponent['lineLength'] = LINE_LENGTH;
    plumeComponent.decreaseLineLength();
    expect(plumeComponent['lineLength']).toBe(LINE_LENGTH - 1);

    plumeComponent['lineLength'] = 0;
    plumeComponent.decreaseLineLength();
    expect(plumeComponent['lineLength']).toBe(0);
  });

  it('#degreeToRad should return a value between 0 and 2*PI', () => {
    let angleRad: number;

    plumeComponent['angle'] = ANGLE;
    angleRad = plumeComponent.degreeToRad(plumeComponent['angle']);
    expect(angleRad).toEqual(ANGLE * DEGREE_TO_RAD);

    plumeComponent['angle'] = BELOW_RANGE_ANGLE;
    angleRad = plumeComponent.degreeToRad(plumeComponent['angle']);
    expect(angleRad).toEqual(Math.PI);

    plumeComponent['angle'] = ABOVE_RANGE_ANGLE;
    angleRad = plumeComponent.degreeToRad(plumeComponent['angle']);
    expect(angleRad).toEqual(0);
  });

});
