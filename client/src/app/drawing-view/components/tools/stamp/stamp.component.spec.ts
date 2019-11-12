// tslint:disable: no-string-literal
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { ColourService } from 'src/app/services/colour_service/colour.service';
import { DrawingStorageService } from 'src/app/services/drawing-storage/drawing-storage.service';
import { AttributesService } from '../assets/attributes/attributes.service';
import { FilterSelection, StampConstants } from '../assets/constants/tool-constants';
import { StampComponent } from './stamp.component';

const RANDOM_ANGLE = 77;
const NUMBER_OF_STAMPS = 6; // number of elements in FilterSelection in assets/tool-constants
const SCALE_FACTOR = 3;
const DUMMY_SVG = '<svg></svg>';
const COLOUR_ARRAY = ['colour1', 'colour2'];
const DELTA_VALUE = 20;

describe('StampComponent', () => {
    let component: StampComponent;
    let attrService: AttributesService;
    let fixture: ComponentFixture<StampComponent>;
    const drawingStorageMock: jasmine.SpyObj<DrawingStorageService> = jasmine.createSpyObj('DrawingStorageService', ['saveDrawing']);
    const attributesService: AttributesService = new AttributesService();
    const colourServiceMock: ColourService = jasmine.createSpyObj('ColourService', ['']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BrowserDynamicTestingModule],
      declarations: [StampComponent],
      providers: [
      { provide: DrawingStorageService, useValue: drawingStorageMock, },
      { provide: AttributesService, useValue: attributesService, },
      { provide: ColourService, useValue: colourServiceMock, },
      ],
    });

    colourServiceMock.colour = COLOUR_ARRAY;
    fixture = TestBed.createComponent(StampComponent);
    attrService = TestBed.get(AttributesService);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  afterEach(() => {
    fixture.destroy();
    attrService.resetSavedAttributes();
  });

  it('should create', () => {
      expect(component).toBeTruthy();
  });

  it('#ngOnInit should not load data if there are no attributes saved in the service', () => {
      attrService.stampAttributes.wasSaved = false;
      attrService.stampAttributes.savedAngle = RANDOM_ANGLE;
      attrService.stampAttributes.savedScaleFactor = SCALE_FACTOR;

      component.ngOnInit();
      expect(component['stamp'].angle).toEqual(StampConstants.DEFAULT_ANGLE,
        'no loading of attributes, yet they did not take default value');
      expect(component['stamp'].scaleFactor).toEqual(StampConstants.DEFAULT_SCALE_FACTOR,
        'no loading of attributes, yet they did not take correct default value');
    });

  it('#ngOnInit should load strokewidth and trace mode if there are attributes saved in the service', () => {
    attrService.stampAttributes.wasSaved = true;
    attrService.stampAttributes.savedAngle = RANDOM_ANGLE;
    attrService.stampAttributes.savedScaleFactor = SCALE_FACTOR;

    component.ngOnInit();

    expect(component['stamp'].angle).toEqual(RANDOM_ANGLE,
        'loading of attributes, yet they did not take default value');
    expect(component['stamp'].scaleFactor).toEqual(SCALE_FACTOR,
        'loading of attributes, yet they did not take correct default value');

  });

  it('#ngOnDestroy should save the current attributes in the stampAttributes interface of the service', () => {
    component.ngOnDestroy();
    expect(attrService.stampAttributes.savedScaleFactor).toEqual(StampConstants.DEFAULT_SCALE_FACTOR,
      'shape.strokeWidth was not successfully saved upon destruction');
    expect(attrService.stampAttributes.savedAngle).toEqual(StampConstants.DEFAULT_ANGLE,
      'the traceMode was not successfully saved upon destruction');
    expect(attrService.stampAttributes.wasSaved).toBe(true, '#ngOnDestroy did not set wasSaved to true');

  });

  it('#onLeftClick only saves the stamp when an svgReference was chosen for it', () => {
    const savingSpy = spyOn(component['drawingStorage'], 'saveDrawing');
    component['stamp'].svgReference = '';
    const clickEvent: MouseEvent = new MouseEvent('click');
    component.onLeftClick(clickEvent);
    expect(savingSpy).not.toHaveBeenCalled();

    component['stamp'].svgReference = DUMMY_SVG;
    component.onLeftClick(clickEvent);
    expect(savingSpy).toHaveBeenCalled();

  });

  it('#OnWheel should be called when the wheel of the mouse is turned', () => {
    const onWheelSpy = spyOn(component, 'onWheel');
    const wheelEvent: WheelEvent = new WheelEvent('wheel');
    fixture.debugElement.triggerEventHandler('wheel', wheelEvent);
    expect(onWheelSpy).toHaveBeenCalled();
  });

  it('#OnWheel should add or substract angleIncrement from stamp.angle depending on the direction in which the wheel is turned', () => {
    const wheelInit: WheelEventInit = {
      deltaX: 0.0,
      deltaY: DELTA_VALUE,
      deltaZ: 0.0,
      deltaMode: 0,
    };
    let wheelEvent: WheelEvent = new WheelEvent('wheel', wheelInit);

    component['stamp'].angle = RANDOM_ANGLE;
    component.onWheel(wheelEvent);
    expect(component['stamp'].angle).toBe(RANDOM_ANGLE + component['angleIncrement']);

    wheelInit.deltaY = - DELTA_VALUE;
    wheelEvent = new WheelEvent('wheel', wheelInit);
    component['stamp'].angle = RANDOM_ANGLE;
    component.onWheel(wheelEvent);
    expect(component['stamp'].angle).toBe(RANDOM_ANGLE - component['angleIncrement']);
  });

  it('#OnKeyDownAltEvent should be called when the ALT key is pressed', () => {
    const onAltSpy = spyOn(component, 'onKeyDownAltEvent');
    const keyDownEvent: KeyboardEvent = new KeyboardEvent('keydown.alt');
    fixture.debugElement.triggerEventHandler('keydown.alt', keyDownEvent);
    expect(onAltSpy).toHaveBeenCalled();
  });

  it('#OnKeyDownAltEvent should toggle the angleIncrement value', () => {
    component['angleIncrement'] = StampConstants.ANGLE_INCREMENT_1;
    component.onKeyDownAltEvent();
    expect(component['angleIncrement']).toBe(StampConstants.ANGLE_INCREMENT_15);

    component.onKeyDownAltEvent();
    expect(component['angleIncrement']).toBe(StampConstants.ANGLE_INCREMENT_1);
  });

  it('#multiplyScaleFactor should reassign the values of the stamp.width and stamp.height', () => {
    component['stamp'].scaleFactor = SCALE_FACTOR;
    component['stamp'].width = StampConstants.DEFAULT_WIDTH;
    component['stamp'].height = StampConstants.DEFAULT_HEIGHT;

    component.multiplyScaleFactor();
    expect(component['stamp'].width).toBe(StampConstants.DEFAULT_WIDTH * SCALE_FACTOR);
    expect(component['stamp'].height).toBe(StampConstants.DEFAULT_HEIGHT * SCALE_FACTOR);
  });

  it('#increaseScaleFactor should increment the value of stamp.scaleFactor by 1 i it is not already at max value', () => {
    component['stamp'].scaleFactor = SCALE_FACTOR;
    const multiplyScaleFactorSpy = spyOn(component, 'multiplyScaleFactor');
    component.increaseScaleFactor();

    expect(component['stamp'].scaleFactor).toBe(SCALE_FACTOR + 1);
    expect(multiplyScaleFactorSpy).toHaveBeenCalled();

    component['stamp'].scaleFactor = StampConstants.MAX_SCALE;
    component.increaseScaleFactor();
    expect(component['stamp'].scaleFactor).toBe(StampConstants.MAX_SCALE, 'got incremented above max value');
    expect(multiplyScaleFactorSpy).toHaveBeenCalled();
  });

  it('#decreaseScaleFactor should decrement the value of stamp.scaleFactor by 1 if it is not already 0', () => {
    component['stamp'].scaleFactor = 0;
    const multiplyScaleFactorSpy = spyOn(component, 'multiplyScaleFactor');
    component.decreaseScaleFactor();

    expect(component['stamp'].scaleFactor).toBe(0, 'decresed scale factor below 0');

    component['stamp'].scaleFactor = SCALE_FACTOR;
    component.decreaseScaleFactor();

    expect(component['stamp'].scaleFactor).toBe(SCALE_FACTOR - 1);
    expect(multiplyScaleFactorSpy).toHaveBeenCalled();
  });

  it('#increaseAngle should increment the value of stamp.angle', () => {
    component['stamp'].angle = RANDOM_ANGLE;
    component.increaseAngle();
    expect(component['stamp'].angle).toBe(RANDOM_ANGLE + 1);
  });

  it('#decreaseAngle should decrement the value of stamp.angle if it is not already 0', () => {
    component['stamp'].angle = 0;
    component.decreaseAngle();

    expect(component['stamp'].angle).toBe(0, 'decresed angle below 0');

    component['stamp'].angle = RANDOM_ANGLE;
    component.decreaseAngle();

    expect(component['stamp'].angle).toBe(RANDOM_ANGLE - 1);
  });

  it('#setStamp should update the path of the stamp to use depending on the filter ID that is passed', () => {
    for (let index = 0; index < NUMBER_OF_STAMPS; index++) {
      component.setStamp(index);

      if (index === FilterSelection.FILTER0) {
        expect(component['stamp'].svgReference).toEqual(component['stampPaths'].HEART);
      }

      if (index === FilterSelection.FILTER1) {
        expect(component['stamp'].svgReference).toEqual(component['stampPaths'].PAW);
      }

      if (index === FilterSelection.FILTER2) {
        expect(component['stamp'].svgReference).toEqual(component['stampPaths'].SMILEY);
      }

      if (index === FilterSelection.FILTER3) {
        expect(component['stamp'].svgReference).toEqual(component['stampPaths'].STAR);
      }

      if (index === FilterSelection.FILTER4) {
        expect(component['stamp'].svgReference).toEqual(component['stampPaths'].THUMB_UP);
      }

      if (index === FilterSelection.FILTER5) {
        expect(component['stamp'].svgReference).toEqual(component['stampPaths'].SUN);
      }

    }
  });

});
