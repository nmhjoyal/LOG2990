import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SprayCanComponent } from './spray-can.component';
import { SprayCanConstants } from '../assets/constants/spray-can-constants';
import { SaveService } from 'src/app/services/save-service/save.service';
import { AttributesService } from '../assets/attributes/attributes.service';
import { ColourService } from 'src/app/services/colour_service/colour.service';
import ClickHelper from 'src/app/helpers/click-helper/click-helper';

describe('SprayCanComponent', () => {
  let component: SprayCanComponent;
  let fixture: ComponentFixture<SprayCanComponent>;
  const clickHelper: ClickHelper = new ClickHelper(); // mock this

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

  it('#ngOnInit', () => {

  });

  it('#ngOnDestroy', () => {

  });

  it('#onMouseDown, should calculate initial values of sprayCan, call #addSpray and set the timer on it', () => {

  });
  
  it('#onMouseUp should clear the timer, save a drawing and reset some values id mousedown is true', () => {

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

    expect(); // expect the 
  });

  it('#calculateDimensions should set x and y to the smallest values, while keeping the biggest width and height possible', () => {

  });

  it('#addSpray should generate a spray interface, calling #generateRandomInt' +
  'and save it in sprayCan.sprays', () => {
    component['mouseX'] = 1;
    component['mouseY'] = 2;
    component['sprayCan'].sprays = [];
    const intGenerationSpy = spyOn<any>(component, 'getRandomInt');
    intGenerationSpy.and.returnValue(3);

    (component as any).addSpray();

    expect(intGenerationSpy).toHaveBeenCalled();
    expect(component['sprayCan'].sprays[0]).toEqual({cx:1, cy:2, seed:3});
  });

  
  it('#increaseValue should increase the diametre or the number of emissinos per second depending on the mode', () => {
    component.increaseValue(0);
    expect(component.sprayPerSecond).toBe(SprayCanConstants.DEFAULT_SPRAY_PER_SECOND + 1);

    component.increaseValue(1);
    expect(component.diameter).toBe(SprayCanConstants.DEFAULT_DIAMETER + SprayCanConstants.DIAMETER_STEP);
  });

  it('##decreaseValue should decrease the diametre or the number of emissinos per second depending on the mode', () => {
    component.decreaseValue(0);
    expect(component.sprayPerSecond).toBe(SprayCanConstants.DEFAULT_SPRAY_PER_SECOND - 1);

    component.decreaseValue(1);
    expect(component.diameter).toBe(SprayCanConstants.DEFAULT_DIAMETER - SprayCanConstants.DIAMETER_STEP);
  
    component.diameter = 0;
    component.sprayPerSecond = 1;

    component.decreaseValue(0);
    expect(component.sprayPerSecond).toBe(1);

    component.decreaseValue(1);
    expect(component.diameter).toBe(0);    
  
  });
});
