import SpyObj = jasmine.SpyObj;
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { DrawingViewModule } from 'src/app/drawing-view/drawing-view.module';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
import { AttributesService } from '../assets/attributes/attributes.service';
import { SelectorComponent } from './selector.component';

describe('SelectorComponent', () => {
    let selector: SelectorComponent;
    let toolHandlerMock: SpyObj<ToolHandlerService>;
    let fixture: ComponentFixture<SelectorComponent>;

    const attrServiceMock: SpyObj<AttributesService> = jasmine.createSpyObj('AttributesService', ['']);
    beforeEach(() => {
        toolHandlerMock = jasmine.createSpyObj('ToolHandlerService', ['']);

        TestBed.configureTestingModule({
            imports: [BrowserDynamicTestingModule, DrawingViewModule],
            providers: [
                { provide: ToolHandlerService, useValue: toolHandlerMock, },
                { provide: AttributesService, useValue: attrServiceMock, },
            ],
        });

        fixture = TestBed.createComponent(SelectorComponent);
        fixture.detectChanges();

        selector = fixture.componentInstance;
    });

    it('should create an instance of the derived class', () => {
        expect(selector).toBeTruthy();
    });

    it('#onMouseDown should be called when left or right mouse button is pressed', () => {
        const spy = spyOn(selector, 'onMouseDown');
        const leftClick = new MouseEvent('mousedown', { button: 0 });
        const rightClick = new MouseEvent('mousedown', { button: 2 });
        fixture.debugElement.triggerEventHandler('mousedown', leftClick);
        expect(spy).toHaveBeenCalled();
        fixture.debugElement.triggerEventHandler('mousedown', rightClick);
        expect(spy).toHaveBeenCalled();
    });

    it('#onMouseMove should be called when cursor moves', () => {
        const spy = spyOn(selector, 'onMouseMove');
        const cursor = new MouseEvent('mousemove');
        fixture.debugElement.triggerEventHandler('mousemove', cursor);
        expect(spy).toHaveBeenCalled();
    });

    it('#onRelease should be called when left or right mouse button is released', () => {
        const spy = spyOn(selector, 'onRelease').and.callFake(() => { return; });
        const mouseUpLeft = new MouseEvent('mouseup', { button: 0 });
        const mouseUpRight = new MouseEvent('mouseup', { button: 2 });
        fixture.debugElement.triggerEventHandler('mouseup', mouseUpLeft);
        expect(spy).toHaveBeenCalled();
        fixture.debugElement.triggerEventHandler('mouseup', mouseUpRight);
        expect(spy).toHaveBeenCalled();
    });
});
