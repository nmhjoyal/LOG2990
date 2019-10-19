import SpyObj = jasmine.SpyObj;
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ColorService } from 'src/app/services/color_service/color.service';
import { SelectorService } from 'src/app/services/selector-service/selector-service';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
import { ClickTypes } from 'src/AppConstants/ClickTypes';
import { AttributesService } from '../assets/attributes/attributes.service';
import { IShape } from '../assets/interfaces/shape-interface';
import { Id } from '../assets/tool-constants';
import { SelectorComponent } from './selector.component';

const FIFTY = 50;
const FORTY = 40;
const drawing = { x: FIFTY, y: FIFTY, width: FIFTY, height: FIFTY,
    fillOpacity: 0, id: Id.RECTANGLE, primaryColor: 'black', secondaryColor: 'black', strokeOpacity: 0, strokeWidth: 1};
class SelectorServiceMock extends SelectorService {

    constructor() {
      super();
    }

    get SelectedObjects(): Set<IShape> {
        const set = new Set<IShape>();
        set.add(drawing);
        return set;
    }

    resetSize(): void {
        return;
    }

    updateCorners(): void {
        return;
    }

    checkForItems(): void {
        return;
    }

    recalculateShape(): void {
        return;
    }

    resetSelectorService(): void {
        return;
    }

    setBoxToDrawing(): void {
        return;
    }
  }

describe('SelectorComponent', () => {
    let selector: SelectorComponent;
    let selectorServiceMock: SelectorService;
    let fixture: ComponentFixture<SelectorComponent>;
    const toolServiceMock: ToolHandlerService = new ToolHandlerService(new ColorService());
    jasmine.createSpyObj('ToolHandlerService', ['selectorBoxExists',
                                                        'saveSelectorBox', 'resetSelectorBox']);
    const attrServiceMock: SpyObj<AttributesService> = jasmine.createSpyObj('AttributesService', ['']);
    beforeEach(() => {
        selectorServiceMock = new SelectorServiceMock();

        TestBed.configureTestingModule({
            declarations: [SelectorComponent],
            providers: [
                { provide: ToolHandlerService, useValue: toolServiceMock},
                { provide: AttributesService, useValue: attrServiceMock, },
            ],
        }).overrideComponent(SelectorComponent, {
            set: {
              providers: [
                { provide: SelectorService, useValue: selectorServiceMock },
              ],
            },
        }).compileComponents();

        fixture = TestBed.createComponent(SelectorComponent);
        fixture.detectChanges();
        selector = fixture.componentInstance;
        spyOn(selectorServiceMock, 'resetSize');
        spyOn(selectorServiceMock, 'updateCorners');
        spyOn(selectorServiceMock, 'checkForItems');
        spyOn(selectorServiceMock, 'recalculateShape');
        spyOn(selectorServiceMock, 'resetSelectorService');
        spyOn(selectorServiceMock, 'cursorTouchesObject').and.returnValue(true);
        spyOn(selectorServiceMock, 'setBoxToDrawing');
        spyOn(toolServiceMock, 'saveSelectorBox').and.callFake(() => { return; });
        spyOn(toolServiceMock, 'resetSelectorBox').and.callThrough();
    });

    it('should create an instance of the derived class', () => {
        expect(selector).toBeTruthy();
    });

    it('#onMouseDown should be called when left or right mouse button is pressed', () => {
        const spy = spyOn(selector, 'onMouseDown');
        const leftClick = new MouseEvent('mousedown', { button: ClickTypes.LEFT_CLICK });
        const rightClick = new MouseEvent('mousedown', { button: ClickTypes.RIGHT_CLICK });
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
        const mouseUpLeft = new MouseEvent('mouseup', { button: ClickTypes.LEFT_CLICK });
        const mouseUpRight = new MouseEvent('mouseup', { button: ClickTypes.RIGHT_CLICK });
        fixture.debugElement.triggerEventHandler('mouseup', mouseUpLeft);
        expect(spy).toHaveBeenCalled();
        fixture.debugElement.triggerEventHandler('mouseup', mouseUpRight);
        expect(spy).toHaveBeenCalled();
    });

    it('#onEscape should be called when escape key pressed', () => {
        const spy = spyOn(selector, 'onEscape').and.callFake(() => { return; });
        const event = new KeyboardEvent('keydown', {
            key: 'Escape',
        });
        document.dispatchEvent(event);
        expect(spy).toHaveBeenCalled();
    });

    it('test leftclick', () => {
        const leftClick = new MouseEvent('mousedown', { button: ClickTypes.LEFT_CLICK });
        selector.onMouseDown(leftClick);
        expect(selectorServiceMock.resetSelectorService).toHaveBeenCalled();
    });

    it('test rightclick drag', () => {
        spyOn(toolServiceMock, 'selectorBoxExists').and.returnValue(false);
        const rightClick = new MouseEvent('mousedown', { button: ClickTypes.RIGHT_CLICK });
        selector.onMouseDown(rightClick);
        expect(selectorServiceMock.resetSelectorService).toHaveBeenCalled();
    });

    it('test leftclick drag', () => {
        const leftClick = new MouseEvent('mousedown', { button: ClickTypes.LEFT_CLICK });
        selector.onMouseDown(leftClick);
        expect(selectorServiceMock.resetSelectorService).toHaveBeenCalled();
        const leftDrag = new MouseEvent('mousemove');
        selector.onMouseMove(leftDrag);
        expect(selectorServiceMock.resetSize).toHaveBeenCalled();
        expect(selectorServiceMock.updateCorners).toHaveBeenCalled();
        expect(selectorServiceMock.checkForItems).toHaveBeenCalled();
        expect(toolServiceMock.saveSelectorBox).toHaveBeenCalled();
    });

    it('test rightclick drag and reverse', () => {
        spyOn(toolServiceMock, 'selectorBoxExists').and.returnValue(true);
        const rightClick = new MouseEvent('mousedown', { button: ClickTypes.RIGHT_CLICK });
        selector.onMouseDown(rightClick);
        const rightDrag = new MouseEvent('mousemove');
        selector.onMouseMove(rightDrag);
        expect(selectorServiceMock.resetSize).toHaveBeenCalled();
        expect(selectorServiceMock.updateCorners).toHaveBeenCalled();
        expect(selectorServiceMock.checkForItems).toHaveBeenCalled();
        expect(selectorServiceMock.recalculateShape).toHaveBeenCalled();
        expect(toolServiceMock.saveSelectorBox).toHaveBeenCalled();
    });

    it('test leftclick drag and release', () => {
        const leftClick = new MouseEvent('mousedown', { button: ClickTypes.LEFT_CLICK });
        selector.onMouseDown(leftClick);
        const leftDrag = new MouseEvent('mousemove');
        selector.onMouseMove(leftDrag);
        const leftRelease = new MouseEvent('mouseup', { button: ClickTypes.LEFT_CLICK });
        selector.onRelease(leftRelease);
        expect(toolServiceMock.saveSelectorBox).toHaveBeenCalled();
    });

    it('test rightclick drag and release', () => {
        spyOn(toolServiceMock, 'selectorBoxExists').and.returnValue(false);
        const rightClick = new MouseEvent('mousedown', { button: ClickTypes.RIGHT_CLICK });
        selector.onMouseDown(rightClick);
        const rightDrag = new MouseEvent('mousemove');
        selector.onMouseMove(rightDrag);
        const rightRelease = new MouseEvent('mouseup', { button: ClickTypes.RIGHT_CLICK });
        selector.onRelease(rightRelease);
        expect(toolServiceMock.saveSelectorBox).toHaveBeenCalled();
    });

    it('test leftclick simple', () => {
        toolServiceMock.drawings = [{ x: FIFTY, y: FIFTY, width: FIFTY, height: FIFTY,
            fillOpacity: 0, id: Id.RECTANGLE, primaryColor: 'black', secondaryColor: 'black', strokeOpacity: 0, strokeWidth: 1}];
        const leftClick = new MouseEvent('mousedown', { button: ClickTypes.LEFT_CLICK });
        selector.onMouseDown(leftClick);
        const leftRelease = new MouseEvent('mouseup', { button: ClickTypes.LEFT_CLICK });
        selector.onRelease(leftRelease);
        expect(toolServiceMock.saveSelectorBox).toHaveBeenCalled();
        expect(selectorServiceMock.setBoxToDrawing).toHaveBeenCalled();
    });

    it('test rightclick simple', () => {
        toolServiceMock.drawings = [drawing];
        const rightClick = new MouseEvent('mousedown', { button: ClickTypes.RIGHT_CLICK });
        selector.onMouseDown(rightClick);
        const rightRelease = new MouseEvent('mouseup', { button: ClickTypes.RIGHT_CLICK });
        selector.onRelease(rightRelease);
        expect(selectorServiceMock.recalculateShape).toHaveBeenCalled();
        expect(toolServiceMock.saveSelectorBox).toHaveBeenCalled();
    });

    it('test rightclick reverse', () => {
        const drawing1 = { x: FORTY, y: FORTY, width: FIFTY, height: FIFTY,
            fillOpacity: 0, id: Id.RECTANGLE, primaryColor: 'black', secondaryColor: 'black', strokeOpacity: 0, strokeWidth: 1};
        const drawing2 = { x: FORTY, y: FORTY, width: FORTY, height: FORTY,
            fillOpacity: 0, id: Id.RECTANGLE, primaryColor: 'black', secondaryColor: 'black', strokeOpacity: 0, strokeWidth: 1};
        toolServiceMock.drawings = [drawing1, drawing2];
        spyOn(toolServiceMock, 'selectorBoxExists').and.returnValue(true);
        const rightClick = new MouseEvent('mousedown', { button: ClickTypes.RIGHT_CLICK });
        const rightRelease = new MouseEvent('mouseup', { button: ClickTypes.RIGHT_CLICK });
        selector.onMouseDown(rightClick);
        selector.onRelease(rightRelease);
        expect(selectorServiceMock.recalculateShape).toHaveBeenCalled();
        expect(toolServiceMock.saveSelectorBox).toHaveBeenCalled();
    });
});
