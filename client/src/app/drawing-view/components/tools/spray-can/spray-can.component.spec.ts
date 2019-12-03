import { ComponentFixture, TestBed } from '@angular/core/testing';

import ClickHelper from 'src/app/helpers/click-helper/click-helper';
import { ColourService } from 'src/app/services/colour_service/colour.service';
import { SaveService } from 'src/app/services/save-service/save.service';
import { AttributesService } from '../assets/attributes/attributes.service';
import { SprayCanConstants } from '../assets/constants/spray-can-constants';
import { SprayCanComponent } from './spray-can.component';

// tslint:disable:no-string-literal
// tslint:disable:no-any

describe('SprayCanComponent', () => {
  let component: SprayCanComponent;
  let fixture: ComponentFixture<SprayCanComponent>;
  let clickHelperSpyX: jasmine.Spy<(event: MouseEvent) => number>;
  let clickHelperSpyY: jasmine.Spy<(event: MouseEvent) => number>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ SprayCanComponent ],
      providers: [
        SaveService,
        AttributesService,
        ColourService,
      ],
    })
    .compileComponents();
    fixture = TestBed.createComponent(SprayCanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    clickHelperSpyX = spyOn(ClickHelper, 'getXPosition');
    clickHelperSpyY = spyOn(ClickHelper, 'getYPosition');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#ngOnInit should not load diameter and sprayPerSecond if there are no attributes saved in the service', () => {
    component['attributeService'].sprayCanAttributes.wasSaved = false;
    component['attributeService'].sprayCanAttributes.savedDiameter = 0;
    component['attributeService'].sprayCanAttributes.savedSprayPerSecond = 0;

    component.ngOnInit();
    expect(component['diameter']).toEqual(SprayCanConstants.DEFAULT_DIAMETER);
    expect(component['sprayPerSecond']).toEqual(SprayCanConstants.DEFAULT_SPRAY_PER_SECOND);
  });

  it('#ngOnInit should load diameter and sprayPerSecond if there are attributes saved in the service', () => {
    component['attributeService'].sprayCanAttributes.wasSaved = true;
    component['attributeService'].sprayCanAttributes.savedDiameter = 0;
    component['attributeService'].sprayCanAttributes.savedSprayPerSecond = 0;

    component.ngOnInit();

    expect(component['diameter']).toBe(0);
    expect(component['sprayPerSecond']).toBe(0);

  });

  it('#ngOnDestroy should save the current attributes in the rectangleAttributes interface of the service', () => {
    component.ngOnDestroy();
    expect(component['diameter']).toEqual(SprayCanConstants.DEFAULT_DIAMETER);
    expect(component['sprayPerSecond']).toEqual(SprayCanConstants.DEFAULT_SPRAY_PER_SECOND);
    expect(component['attributeService'].sprayCanAttributes.wasSaved).toBe(true, '#ngOnDestroy did not set wasSaved to true');

  });

  it('#onMouseDown, should calculate initial values of sprayCan, call #addSpray and set the timer on it', () => {
    const setIntervalSpy = spyOn(window, 'setInterval');
    const addSpraySpy = spyOn<any>(component, 'addSpray');
    const mockMouseEvent: MouseEvent = new MouseEvent('mousedown');
    clickHelperSpyX.and.returnValue(1);
    clickHelperSpyY.and.returnValue(1);
    setIntervalSpy.and.callThrough();
    component['isMouseDown'] = false;

    component.onMouseDown(mockMouseEvent);
    expect(component['isMouseDown']).toBe(true);
    expect(component['sprayCan'].radius).toBe(component['diameter'] / 2);
    expect(component['sprayCan'].width).toBe(component['sprayCan'].height);
    expect(component['sprayCan'].height).toBe(component['diameter']);
    expect(component['mouseX']).toBe(1);
    expect(component['mouseY']).toBe(1);
    expect(addSpraySpy).toHaveBeenCalled();
    expect(setIntervalSpy).toHaveBeenCalled();

  });

  it('#onMouseUp should clear the timer, save a drawing and reset some values id mousedown is true', () => {
    const windowSpy = spyOn(window, 'clearInterval');
    const saveSpy = spyOn(component['saveService'], 'saveDrawing');
    windowSpy.and.callThrough();
    component['isMouseDown'] = false;

    component.onMouseUp();
    expect(windowSpy).not.toHaveBeenCalled();

    component['isMouseDown'] = true;
    component.onMouseUp();
    expect(windowSpy).toHaveBeenCalled();
    expect(saveSpy).toHaveBeenCalled();
    expect(component['sprayCan'].sprays.length).toBe(0);
    expect(component['mouseX']).toBe(0);
    expect(component['mouseY']).toBe(0);
    expect(component['isMouseDown']).toBe(false);

  });

  it('#onMouseLeave should call #onMouseUp if mouseDown is true', () => {
    const mouseUpSpy = spyOn(component, 'onMouseUp');
    component['isMouseDown'] = false;
    component.onMouseLeave();
    expect(mouseUpSpy).not.toHaveBeenCalled();

    component['isMouseDown'] = true;
    component.onMouseLeave();
    expect(mouseUpSpy).toHaveBeenCalled();
  });

  it('#onMouseMove should update mouseX and Y if mousdown is true', () => {
    component['isMouseDown'] = false;
    const mockMouseEvent: MouseEvent = new MouseEvent('mousemove');

    component.onMouseMove(mockMouseEvent);
    expect(clickHelperSpyX).not.toHaveBeenCalled();
    expect(clickHelperSpyY).not.toHaveBeenCalled();

    component['isMouseDown'] = true;
    component.onMouseMove(mockMouseEvent);
    expect(clickHelperSpyX).toHaveBeenCalled();
    expect(clickHelperSpyY).toHaveBeenCalled();
  });

  it('#addSpray should generate a spray interface, calling #generateRandomInt' +
  'and save it in sprayCan.sprays, and then call calculate dimensions', () => {
    component['mouseX'] = 1;
    component['mouseY'] = 2;
    component['sprayCan'].sprays = [];
    const intGenerationSpy = spyOn<any>(component, 'getRandomInt');
    const calculateDimensionsSpy = spyOn<any>(component, 'calculateDimensions');
    // tslint:disable:no-magic-numbers
    intGenerationSpy.and.returnValue(3);

    (component as any).addSpray();

    expect(intGenerationSpy).toHaveBeenCalled();
    expect(calculateDimensionsSpy).toHaveBeenCalled();
    expect(component['sprayCan'].sprays[0]).toEqual({cx: 1, cy: 2, seed: 3});
    // tslint:enable:no-magic-numbers
  });
});
