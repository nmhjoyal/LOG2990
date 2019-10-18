    // tslint:disable: no-string-literal
    import { HttpClientModule } from '@angular/common/http';
    import { async, ComponentFixture, TestBed } from '@angular/core/testing';
    import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
    import { DrawingViewModule } from 'src/app/drawing-view/drawing-view.module';
    import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
    import { CrayonComponent } from './crayon.component';
    import { OnInit, OnDestroy } from '@angular/core';
    import { AttributesService } from '../../assets/attributes/attributes.service';
    import { StrokeAbstract } from '../../assets/abstracts/stroke-abstract/stroke-abstract';
import { ColorService } from 'src/app/services/color_service/color.service';
    
    class AbstractSpy extends StrokeAbstract implements OnInit, OnDestroy {
    
      constructor(serviceInstance: ToolHandlerService, attributesInstance: AttributesService, colorInstance: ColorService) {
        super(serviceInstance, attributesInstance, colorInstance);
      }
      // mock of abstract methods
      ngOnInit(): void {
      // empty block
      }
      ngOnDestroy(): void {
          // empty block
      }
      saveShape(): void {
        // empty block
      }
      saveAttribute(): void{
        // empty block
      }
    }
    
    describe('CrayonComponent', () => {
      let component: CrayonComponent;
      let fixture: ComponentFixture<CrayonComponent>;
      let toolSpy: ToolHandlerService;
      let attributeSpy: AttributesService;
      let colorSpy: ColorService;
      let abstractSpy: AbstractSpy;
    
      beforeEach(async(() => {
        TestBed.configureTestingModule({
          declarations: [
          ],
          imports: [
            HttpClientModule,
            BrowserAnimationsModule,
            DrawingViewModule,
          ],
        })
          .compileComponents();
      }));
    
      beforeEach( async () => {
        fixture = TestBed.createComponent(CrayonComponent);
        colorSpy = new ColorService();
        toolSpy = new ToolHandlerService(colorSpy);
        attributeSpy = new AttributesService();
        component = new CrayonComponent(toolSpy, attributeSpy, colorSpy);
        fixture.detectChanges();
        abstractSpy = new AbstractSpy(toolSpy, attributeSpy, colorSpy);
      });
    
      it('should create', () => {
        expect(component).toBeTruthy();
      });
    
      it('should save the attribute when the component is destroyed', () => {
        const spy = spyOn(component, 'saveAttribute');
        component.ngOnDestroy();
        expect(spy).toHaveBeenCalled();
      });
    
      it('should properly save the attributes', () => {
        abstractSpy['stroke'].strokeWidth = 3;
        abstractSpy.saveAttribute();
        expect(attributeSpy.paintbrushAttributes.savedStrokeWidth).toEqual(abstractSpy['stroke'].strokeWidth);
      });
    
      
    
    });
    
