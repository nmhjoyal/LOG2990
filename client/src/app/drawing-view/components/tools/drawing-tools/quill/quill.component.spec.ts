// tslint:disable:no-string-literal
// tslint:disable:no-magic-numbers
// tslint:disable:no-any

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DrawingStorageService } from 'src/app/services/drawing-storage/drawing-storage.service';
import { SaveService } from 'src/app/services/save-service/save.service';
import { AttributesService } from '../../assets/attributes/attributes.service';
import { ToolConstants } from '../../assets/constants/tool-constants';
import { QuillComponent } from './quill.component';

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

describe('QuillComponent', () => {
  let quillComponent: QuillComponent;
  let attrService: AttributesService;
  let fixture: ComponentFixture<QuillComponent>;
  const drawingServiceMock: DrawingStorageService = new DrawingStorageService();
  const attributesServiceMock: AttributesService = new AttributesService();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [QuillComponent],
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
    fixture = TestBed.createComponent(QuillComponent);
    attrService = TestBed.get(AttributesService);
    quillComponent = fixture.componentInstance;
    drawingServiceMock.emptyDrawings();
  });

  afterEach(() => {
    fixture.destroy();
    attrService.resetSavedAttributes();
  });

  it('should create', () => {
    expect(quillComponent).toBeTruthy();
  });

  it('should save the attribute when the component is destroyed', () => {
    const spy = spyOn(quillComponent, 'saveAttribute');
    quillComponent.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
  });

  it('should properly save the attributes', () => {
    quillComponent.ngOnDestroy();
    expect(attrService.quillAttributes.savedLineLength).toEqual(ToolConstants.DEFAULT_LINE_LENGTH,
      'stroke.strokeWidth was not successfully saved upon destruction');
    expect(attrService.quillAttributes.savedAngle).toEqual(ToolConstants.DEFAULT_ANGLE,
      'stroke.strokeWidth was not successfully saved upon destruction');
    expect(attrService.quillAttributes.wasSaved).toBe(true, '#ngOnDestroy did not set wasSaved to true');
  });

  it('#ngOnInit should not load angle and line length if there are no attributes saved in the service', () => {
    attrService.quillAttributes.wasSaved = false;
    attrService.quillAttributes.savedLineLength = LINE_LENGTH;
    attrService.quillAttributes.savedAngle = ANGLE;
    quillComponent.ngOnInit();
    expect(quillComponent['lineLength']).toEqual(ToolConstants.DEFAULT_LINE_LENGTH,
      'no loading of attributes, yet minWidth did not take default value');
    expect(quillComponent['angle']).toEqual(ToolConstants.DEFAULT_ANGLE,
      'no loading of attributes, yet maxWidth did not take default value');
  });

  it('#ngOnInit should load angle and line length if there are attributes saved in the service', () => {
    attrService.quillAttributes.wasSaved = true;
    attrService.quillAttributes.savedLineLength = LINE_LENGTH;
    attrService.quillAttributes.savedAngle = ANGLE;
    quillComponent.ngOnInit();
    expect(quillComponent['lineLength']).toEqual(LINE_LENGTH,
      'loading of attributes, yet minWidth did not take saved value');
    expect(quillComponent['angle']).toEqual(ANGLE,
      'loading of attributes, yet maxWidth did not take saved value');
  });

  it('#calculatePath should call fillGaps if the distance is greater than the stroke-width of the line', () => {
    const spy = spyOn<any>(quillComponent, 'fillGaps');

    quillComponent['lastX'] = LAST_X;
    quillComponent['lastY'] = LAST_Y;
    quillComponent['calculatePath'](LAST_X, LAST_Y);
    expect(spy).not.toHaveBeenCalled();

    quillComponent['lastX'] = LAST_X;
    quillComponent['lastY'] = LAST_Y;
    quillComponent['calculatePath'](NEW_X, NEW_Y);
    expect(spy).toHaveBeenCalled();
  });

  it('#fill gaps should call addPath', () => {
    const spy = spyOn<any>(quillComponent, 'addPath');
    quillComponent['fillGaps'](3, 4, 5);
    expect(spy).toHaveBeenCalled();
  });

  it('#addPath should add path if quill.path exists', () => {
    (quillComponent as any).addPath(0, 0);
    if (quillComponent['quill'].paths) {
      expect(quillComponent['quill'].paths.length).toEqual(1);
    }
  });

  it('#onMouseUp should call drawingStorage.saveDrawing', () => {
    const spy = spyOn(quillComponent['drawingStorage'], 'saveDrawing');
    const mouseEvent: MouseEvent = new MouseEvent('mousedown');
    quillComponent.onMouseUp(mouseEvent);
    expect(spy).toHaveBeenCalled();
  });

  it('#onMouseDown should set the correct values', () => {
    const mouseEvent: MouseEvent = new MouseEvent('mousedown');
    quillComponent.onMouseDown(mouseEvent);
    expect(quillComponent['quill'].x).toEqual(quillComponent['lastX']);
    expect(quillComponent['quill'].y).toEqual(quillComponent['lastY']);
    expect(quillComponent['quill'].width).toEqual(0);
    expect(quillComponent['quill'].height).toEqual(0);
    expect(quillComponent['quill'].points).toEqual(quillComponent['lastX'] + ',' + quillComponent['lastY']);
  });

  it('#onMouseMove should change the values of lastX and lastY if mouseDown is true', () => {
    const mouseEvent: MouseEvent = new MouseEvent('mousedown');
    quillComponent['lastX'] = 0;
    quillComponent['lastY'] = 0;

    quillComponent['mouseDown'] = false;
    quillComponent.onMouseMove(mouseEvent);
    expect(quillComponent['lastX']).toBe(0);
    expect(quillComponent['lastY']).toBe(0);

    quillComponent['mouseDown'] = true;
    quillComponent.onMouseMove(mouseEvent);
    expect(quillComponent['lastX']).toEqual(mouseEvent.offsetX);
    expect(quillComponent['lastY']).toEqual(mouseEvent.offsetY);
  });

  it('#OnWheel should be called when the wheel of the mouse is turned', () => {
    const onWheelSpy = spyOn(quillComponent, 'onWheel');
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

    quillComponent['angle'] = ANGLE;
    quillComponent.onWheel(wheelEvent);
    expect(quillComponent['angle']).toBe(ANGLE + quillComponent['angleIncrement']);

    wheelInit.deltaY = - DELTA_VALUE;
    wheelEvent = new WheelEvent('wheel', wheelInit);
    quillComponent['angle'] = ANGLE;
    quillComponent.onWheel(wheelEvent);
    expect(quillComponent['angle']).toBe(ANGLE - quillComponent['angleIncrement']);
  });

  it('#OnKeyDownAlt should be called when the ALT key is pressed', () => {
    const onAltSpy = spyOn(quillComponent, 'onKeyDownAlt');
    const keyDownEvent: KeyboardEvent = new KeyboardEvent('keydown.alt');
    fixture.debugElement.triggerEventHandler('keydown.alt', keyDownEvent);
    expect(onAltSpy).toHaveBeenCalled();
  });

  it('#OnKeyDownAlt should toggle the angleIncrement value', () => {
    quillComponent['angleIncrement'] = ToolConstants.ANGLE_INCREMENT_1;
    quillComponent.onKeyDownAlt();
    expect(quillComponent['angleIncrement']).toBe(ToolConstants.ANGLE_INCREMENT_15);

    quillComponent.onKeyDownAlt();
    expect(quillComponent['angleIncrement']).toBe(ToolConstants.ANGLE_INCREMENT_1);
  });

  it('#increaseAngle should increment the value of angle', () => {
    quillComponent['angle'] = ANGLE;
    quillComponent.increaseAngle(ToolConstants.ANGLE_INCREMENT_1);
    expect(quillComponent['angle']).toBe(ANGLE + 1);
  });

  it('#decreaseAngle should decrement the value of angle', () => {
    quillComponent['angle'] = ANGLE;
    quillComponent.decreaseAngle(ToolConstants.ANGLE_INCREMENT_1);
    expect(quillComponent['angle']).toBe(ANGLE - 1);
  });

  it('#increaseLineLength should increment the value of lineLength', () => {
    quillComponent['lineLength'] = LINE_LENGTH;
    quillComponent.increaseLineLength();
    expect(quillComponent['lineLength']).toBe(LINE_LENGTH + 1);
  });

  it('#decreaseLineLength should decrement the value of lineLength if it is bigger than 0', () => {
    quillComponent['lineLength'] = LINE_LENGTH;
    quillComponent.decreaseLineLength();
    expect(quillComponent['lineLength']).toBe(LINE_LENGTH - 1);

    quillComponent['lineLength'] = 0;
    quillComponent.decreaseLineLength();
    expect(quillComponent['lineLength']).toBe(0);
  });

  it('#degreeToRad should return a value between 0 and 2*PI', () => {
    let angleRad: number;

    quillComponent['angle'] = ANGLE;
    angleRad = quillComponent.degreeToRad(quillComponent['angle']);
    expect(angleRad).toEqual(ANGLE * DEGREE_TO_RAD);

    quillComponent['angle'] = BELOW_RANGE_ANGLE;
    angleRad = quillComponent.degreeToRad(quillComponent['angle']);
    expect(angleRad).toEqual(Math.PI);

    quillComponent['angle'] = ABOVE_RANGE_ANGLE;
    angleRad = quillComponent.degreeToRad(quillComponent['angle']);
    expect(angleRad).toEqual(0);
  });

  it('#updatePositionAndDimensions should update the position and dimensions of quill component', () => {

    quillComponent['quill'].x = 1;
    quillComponent['quill'].y = 1;
    quillComponent['quill'].width = 1;
    quillComponent['quill'].height = 1;

    (quillComponent as any).updatePositionAndDimensions(0, 0);
    expect(quillComponent['quill'].x).toEqual(0);
    expect(quillComponent['quill'].y).toEqual(0);

    (quillComponent as any).updatePositionAndDimensions(1, 1);
    expect(quillComponent['quill'].x).toEqual(0);
    expect(quillComponent['quill'].y).toEqual(0);

    (quillComponent as any).updatePositionAndDimensions(2, 2);
    expect(quillComponent['quill'].width).toEqual(2);
    expect(quillComponent['quill'].height).toEqual(2);

    (quillComponent as any).updatePositionAndDimensions(0, 0);
    expect(quillComponent['quill'].width).toEqual(2);
    expect(quillComponent['quill'].height).toEqual(2);
  });
});

// tslint:enable:no-string-literal
// tslint:enable:no-magic-numbers
// tslint:enable:no-any
