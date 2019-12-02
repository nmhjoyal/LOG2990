import { async, ComponentFixture, TestBed } from '@angular/core/testing';

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
  const clickHelperSpy = jasmine.createSpyObj('ClickHelper', ['getXPosition', 'getYPosition']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SprayCanComponent ],
      providers: [
        SaveService,
        AttributesService,
        ColourService,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SprayCanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
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
    clickHelperSpy.getXPosition.and.returnValue(1);
    clickHelperSpy.getYPosition.and.returnValue(1);
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
    expect(clickHelperSpy.getXPosition).not.toHaveBeenCalled();
    expect(clickHelperSpy.getYPosition).not.toHaveBeenCalled();

    component['isMouseDown'] = true;
    component.onMouseMove(mockMouseEvent);
    expect(clickHelperSpy.getXPosition).toHaveBeenCalled();
    expect(clickHelperSpy.getYPosition).toHaveBeenCalled();
  });

  it('#calculateDimensions should set x and y to the smallest values, while keeping the biggest width and height possible', () => {

  });

  it('#addSpray should generate a spray interface, calling #generateRandomInt' +
  'and save it in sprayCan.sprays', () => {
    component['mouseX'] = 1;
    component['mouseY'] = 2;
    component['sprayCan'].sprays = [];
    const intGenerationSpy = spyOn<any>(component, 'getRandomInt');
    // tslint:disable:no-magic-numbers
    intGenerationSpy.and.returnValue(3);

    (component as any).addSpray();

    expect(intGenerationSpy).toHaveBeenCalled();
    expect(component['sprayCan'].sprays[0]).toEqual({cx: 1, cy: 2, seed: 3});
    // tslint:enable:no-magic-numbers
  });

  it('#increaseValue should increase the diametre or the number of emissinos per second depending on the mode', () => {
    component.increaseValue(0);
    expect(component['sprayPerSecond']).toBe(SprayCanConstants.DEFAULT_SPRAY_PER_SECOND + 1);

    component.increaseValue(1);
    expect(component['diameter']).toBe(SprayCanConstants.DEFAULT_DIAMETER + SprayCanConstants.DIAMETER_STEP);
  });

  it('##decreaseValue should decrease the diametre or the number of emissinos per second depending on the mode', () => {
    component.decreaseValue(0);
    expect(component['sprayPerSecond']).toBe(SprayCanConstants.DEFAULT_SPRAY_PER_SECOND - 1);

    component.decreaseValue(1);
    expect(component['diameter']).toBe(SprayCanConstants.DEFAULT_DIAMETER - SprayCanConstants.DIAMETER_STEP);

    component['diameter'] = 0;
    component['sprayPerSecond'] = 1;

    component.decreaseValue(0);
    expect(component['sprayPerSecond']).toBe(1);

    component.decreaseValue(1);
    expect(component['diameter']).toBe(0);

  });
});
