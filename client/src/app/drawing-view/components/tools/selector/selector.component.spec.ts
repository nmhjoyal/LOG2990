import SpyObj = jasmine.SpyObj;
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CanvasInformationService } from 'src/app/services/canvas-information/canvas-information.service';
import { ColourService } from 'src/app/services/colour_service/colour.service';
import { DrawingStorageService } from 'src/app/services/drawing-storage/drawing-storage.service';
import { ParserService } from 'src/app/services/parser-service/parser.service';
import { SaveService } from 'src/app/services/save-service/save.service';
import { SelectorService } from 'src/app/services/selector-service/selector-service';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
import { UndoRedoService } from 'src/app/services/undo-redo/undo-redo.service';
import { ClickTypes } from 'src/AppConstants/ClickTypes';
import { AttributesService } from '../assets/attributes/attributes.service';
import { Id } from '../assets/constants/tool-constants';
import { ITools } from '../assets/interfaces/itools';
import { SelectorComponent } from './selector.component';

const FIFTY = 50;
const FORTY = 40;
const drawing = { x: FIFTY, y: FIFTY, width: FIFTY, height: FIFTY, id: Id.RECTANGLE };

class SelectorServiceMock extends SelectorService {

    constructor(public saveService: SaveService, public parserService: ParserService) {
        super(saveService, parserService);
    }

    get SelectedObjects(): Set<ITools> {
        const set = new Set<ITools>();
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
    const TWICE = 2;
    let selector: SelectorComponent;
    let selectorServiceMock: SelectorService;
    let fixture: ComponentFixture<SelectorComponent>;
    let toolServiceMock: ToolHandlerService;
    const parserService: ParserService = new ParserService();
    const drawingStorage: DrawingStorageService = new DrawingStorageService();
    const canvasInformation: CanvasInformationService = new CanvasInformationService();
    const undoRedo: UndoRedoService = new UndoRedoService(drawingStorage, canvasInformation);
    const saveService: SaveService = new SaveService(drawingStorage, undoRedo);
    jasmine.createSpyObj('ToolHandlerService', ['selectorBoxExists',
        'saveSelectorBox', 'resetSelectorBox']);
    const attrServiceMock: SpyObj<AttributesService> = jasmine.createSpyObj('AttributesService', ['']);
    beforeEach(() => {
        selectorServiceMock = new SelectorServiceMock(saveService, parserService);

        TestBed.configureTestingModule({
            declarations: [SelectorComponent],
            providers: [
                ToolHandlerService,
                DrawingStorageService,
                SaveService,
                ColourService,
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
        toolServiceMock = TestBed.get(ToolHandlerService);
        selector = fixture.componentInstance;
        selector['shouldDrag'] = false;

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
        fixture.debugElement.triggerEventHandler('mousedown', rightClick);
        expect(spy).toHaveBeenCalledTimes(TWICE);
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
        fixture.debugElement.triggerEventHandler('mouseup', mouseUpRight);
        expect(spy).toHaveBeenCalledTimes(TWICE);
    });

    it('#onMouseUp should not save shape', () => {
        selector.onMouseUp();
        expect(toolServiceMock.saveSelectorBox).not.toHaveBeenCalled();
    });

    it('#onLeftClick should do nothing', () => {
        const event = new MouseEvent('click');
        spyOn(event, 'preventDefault').and.callThrough();
        selector.onLeftClick(event);
        expect(event.preventDefault).toHaveBeenCalled();
    });

    it('#onRightClick should do nothing', () => {
        const event = new MouseEvent('contextmenu');
        spyOn(event, 'preventDefault').and.callThrough();
        selector.onRightClick(event);
        expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should reset the service on a left click', () => {
        const leftClick = new MouseEvent('mousedown', { button: ClickTypes.LEFT_CLICK });
        selector.onMouseDown(leftClick);
        expect(selectorServiceMock.resetSelectorService).toHaveBeenCalled();
    });

    it('should reset the service on a right click drag', () => {
        spyOn(toolServiceMock, 'selectorBoxExists').and.returnValue(false);
        const rightClick = new MouseEvent('mousedown', { button: ClickTypes.RIGHT_CLICK });
        selector.onMouseDown(rightClick);
        expect(selectorServiceMock.resetSelectorService).toHaveBeenCalled();
    });

    it('should reset on a mousewheel click ', () => {
        const wheelClick = new MouseEvent('mousedown', { button: ClickTypes.WHEEL_BUTTON });
        selector.onMouseDown(wheelClick);
        selector.onRelease(wheelClick);
        expect(toolServiceMock.resetSelectorBox).toHaveBeenCalled();
        expect(selectorServiceMock.resetSelectorService).toHaveBeenCalled();
    });

    it('should update the selector box on a left click drag ', () => {
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

    it('should update the preview box on a right click drag', () => {
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
        selector.onRelease(new MouseEvent('mouseup'));
        selector.onMouseMove(rightDrag);
    });

    it('should call the appropriate functions on a left click drag and reverse', () => {
        const leftClick = new MouseEvent('mousedown', { button: ClickTypes.LEFT_CLICK });
        selector.onMouseDown(leftClick);
        const leftDrag = new MouseEvent('mousemove');
        selector.onMouseMove(leftDrag);
        const leftRelease = new MouseEvent('mouseup', { button: ClickTypes.LEFT_CLICK });
        selector.onRelease(leftRelease);
        expect(toolServiceMock.saveSelectorBox).toHaveBeenCalled();
    });

    it('should call the appropriate functions on a right click drag and reverse', () => {
        spyOn(toolServiceMock, 'selectorBoxExists').and.returnValue(false);
        const rightClick = new MouseEvent('mousedown', { button: ClickTypes.RIGHT_CLICK });
        selector.onMouseDown(rightClick);
        const rightDrag = new MouseEvent('mousemove');
        selector.onMouseMove(rightDrag);
        const rightRelease = new MouseEvent('mouseup', { button: ClickTypes.RIGHT_CLICK });
        selector.onRelease(rightRelease);
        expect(toolServiceMock.saveSelectorBox).toHaveBeenCalled();
    });

    it('should call the call the appropriate functions on a simple left click', () => {
        TestBed.get(DrawingStorageService).drawings = [{ x: FIFTY, y: FIFTY, width: FIFTY, height: FIFTY, id: Id.RECTANGLE }];
        const leftClick = new MouseEvent('mousedown', { button: ClickTypes.LEFT_CLICK });
        selector.onMouseDown(leftClick);
        const leftRelease = new MouseEvent('mouseup', { button: ClickTypes.LEFT_CLICK });
        selector.onRelease(leftRelease);
        expect(toolServiceMock.saveSelectorBox).toHaveBeenCalled();
        expect(selectorServiceMock.setBoxToDrawing).toHaveBeenCalled();
        // tslint:disable-next-line:no-string-literal
        selector['drawingStorage'].drawings = [];
        selector.onMouseDown(leftClick);
        selector.onRelease(leftRelease);
        expect(toolServiceMock.resetSelectorBox).toHaveBeenCalled();
        expect(selectorServiceMock.resetSelectorService).toHaveBeenCalled();
    });

    it('should call the call the appropriate functions on a simple right click', () => {
        TestBed.get(DrawingStorageService).drawings = [drawing];
        const rightClick = new MouseEvent('mousedown', { button: ClickTypes.RIGHT_CLICK });
        selector.onMouseDown(rightClick);
        const rightRelease = new MouseEvent('mouseup', { button: ClickTypes.RIGHT_CLICK });
        selector.onRelease(rightRelease);
        expect(selectorServiceMock.recalculateShape).toHaveBeenCalled();
        expect(toolServiceMock.saveSelectorBox).toHaveBeenCalled();
        const selectorBoxExists = spyOn(toolServiceMock, 'selectorBoxExists');
        selectorBoxExists.and.returnValue(false);
        // tslint:disable-next-line:no-string-literal
        selector['drawingStorage'].drawings = [{ x: FORTY, y: FORTY, width: FORTY, height: FORTY, id: Id.RECTANGLE }];
        selector.onMouseDown(rightClick);
        selector.onRelease(rightRelease);
        expect(selectorServiceMock.setBoxToDrawing).toHaveBeenCalled();
    });

    it('test rightclick reverse', () => {
        const drawing1 = {
            x: FORTY, y: FORTY, width: FIFTY, height: FIFTY, fillOpacity: 0,
            id: Id.RECTANGLE, primaryColour: 'black', secondaryColour: 'black', strokeOpacity: 0, strokeWidth: 1,
        };
        const drawing2 = {
            x: FORTY, y: FORTY, width: FORTY, height: FORTY, fillOpacity: 0,
            id: Id.RECTANGLE, primaryColour: 'black', secondaryColour: 'black', strokeOpacity: 0, strokeWidth: 1,
        };
        TestBed.get(DrawingStorageService).drawings = [drawing1, drawing2];
        spyOn(toolServiceMock, 'selectorBoxExists').and.returnValue(true);
        const rightClick = new MouseEvent('mousedown', { button: ClickTypes.RIGHT_CLICK });
        const rightRelease = new MouseEvent('mouseup', { button: ClickTypes.RIGHT_CLICK });
        selector.onMouseDown(rightClick);
        selector.onRelease(rightRelease);
        expect(selectorServiceMock.recalculateShape).toHaveBeenCalled();
        expect(toolServiceMock.saveSelectorBox).toHaveBeenCalled();
    });
});
