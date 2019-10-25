// tslint:disable: no-string-literal
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
import { AttributesService } from '../assets/attributes/attributes.service';
import { StampComponent } from './stamp.component';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { StampConstants } from '../assets/tool-constants';
import { ColorService } from 'src/app/services/color_service/color.service';

const RANDOM_ANGLE = 77;
const SCALE_FACTOR = 3;
const DUMMY_SVG = '<svg></svg>'

describe('StampComponent', () => {
    let component: StampComponent;
    let attrService: AttributesService;
    let fixture: ComponentFixture<StampComponent>;
    const toolServiceMock: jasmine.SpyObj<ToolHandlerService> = jasmine.createSpyObj('ToolHandlerService', ['']);
    const attributesServiceMock: AttributesService = new AttributesService();
    const colorServiceMock: ColorService = jasmine.createSpyObj('ColorService', ['']);

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [StampComponent],
            imports: [BrowserDynamicTestingModule],
            providers: [
            { provide: ToolHandlerService, useValue: toolServiceMock, },
            { provide: AttributesService, useValue: attributesServiceMock, },
            { provide: ColorService, useValue: colorServiceMock, },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(StampComponent);
        component = fixture.componentInstance;
        attrService = TestBed.get(attributesServiceMock);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('#OnWheel should be called when the wheel of the mouse is turned', () => {
      const onWheelSpy = spyOn(component, 'onWheel');
      const wheelEvent: WheelEvent = new WheelEvent('wheel');
      fixture.debugElement.triggerEventHandler('wheel', wheelEvent);
      expect(onWheelSpy).toHaveBeenCalled();
    });

    it('#OnKeyDownAltEvent should be called when the ALT key is pressed', () => {
      const onAltSpy = spyOn(component, 'onKeyDownAltEvent');
      const keyDownEvent: KeyboardEvent = new KeyboardEvent('alt');
      fixture.debugElement.triggerEventHandler('keydown.alt', keyDownEvent);
      expect(onAltSpy).toHaveBeenCalled();
    });

    it('#ngOnInit should not load data if there are no attributes saved in the service', () => {
        attrService.stampAttributes.wasSaved = false;
        attrService.stampAttributes.savedAngle = RANDOM_ANGLE;
        attrService.stampAttributes.savedScaleFactor = SCALE_FACTOR;
    
        component.ngOnInit();
        expect(component.stamp.angle).toEqual(StampConstants.DEFAULT_ANGLE,
          'no loading of attributes, yet they did not take default value');
        expect(component.stamp.scaleFactor).toEqual(StampConstants.DEFAULT_SCALE_FACTOR,
          'no loading of attributes, yet they did not take correct default value');
      });
    
      it('#ngOnInit should load strokewidth and trace mode if there are attributes saved in the service', () => {
        attrService.stampAttributes.wasSaved = true;
        attrService.stampAttributes.savedAngle = RANDOM_ANGLE;
        attrService.stampAttributes.savedScaleFactor = SCALE_FACTOR;
    
        component.ngOnInit();
    
        expect(component.stamp.angle).toEqual(RANDOM_ANGLE,
            'loading of attributes, yet they did not take default value');
        expect(component.stamp.scaleFactor).toEqual(SCALE_FACTOR,
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

      it('#onLeftClick only saves the stamp when an sgReference was chosen for it', () => {
        let savingSpy = spyOn(component['toolServiceRef'].drawings, "push");
        component.stamp.svgReference = '';
        const clickEvent: MouseEvent = new MouseEvent('click');
        component.onLeftClick(clickEvent);
        expect(savingSpy).not.toHaveBeenCalled();

        component.stamp.svgReference = DUMMY_SVG;
        component.onLeftClick(clickEvent);
        expect(savingSpy).toHaveBeenCalled();

      });


});