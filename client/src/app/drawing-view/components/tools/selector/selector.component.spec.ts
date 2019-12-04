// tslint:disable: no-string-literal no-any

import SpyObj = jasmine.SpyObj;
import { ComponentFixture, TestBed } from '@angular/core/testing';
import ClickHelper from 'src/app/helpers/click-helper/click-helper';
import { CanvasInformationService } from 'src/app/services/canvas-information/canvas-information.service';
import { ColourService } from 'src/app/services/colour_service/colour.service';
import { DragService } from 'src/app/services/drag/drag.service';
import { DrawingStorageService } from 'src/app/services/drawing-storage/drawing-storage.service';
import { GridService } from 'src/app/services/grid/grid.service';
import { ResizeService } from 'src/app/services/resize-service/resize-service';
import { SaveService } from 'src/app/services/save-service/save.service';
import { SelectorService } from 'src/app/services/selector-service/selector-service';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
import { UndoRedoService } from 'src/app/services/undo-redo/undo-redo.service';
import { ClickTypes } from 'src/AppConstants/ClickTypes';
import { AttributesService } from '../assets/attributes/attributes.service';
import { ControlPoints } from '../assets/constants/selector-constants';
import { Id } from '../assets/constants/tool-constants';
import { ITools } from '../assets/interfaces/itools';
import { SelectorComponent } from './selector.component';

const FIFTY = 50;
const FORTY = 40;
const drawing = { x: FIFTY, y: FIFTY, width: FIFTY, height: FIFTY, id: Id.RECTANGLE };

class SelectorServiceMock extends SelectorService {
    selectedObjects: Set<ITools>;

    constructor(public saveService: SaveService) {
        super(saveService);
        this.selectedObjects = new Set<ITools>();
        this.selectedObjects.add(drawing);
    }

    get SelectedObjects(): Set<ITools> {
        return this.selectedObjects;
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
    const resizeServiceMock: SpyObj<ResizeService> = jasmine.createSpyObj('ResizeService', ['resizeAxis', 'resizePosition',
        'resizeAxesFromCenter', 'resizeWithAspectRatio']);
    const drawingStorage: DrawingStorageService = new DrawingStorageService();
    const canvasInformation: CanvasInformationService = new CanvasInformationService();
    const undoRedo: UndoRedoService = new UndoRedoService(drawingStorage, canvasInformation);
    const saveService: SaveService = new SaveService(drawingStorage, undoRedo);
    const gridService: GridService = new GridService();
    let dragService: DragService;
    jasmine.createSpyObj('ToolHandlerService', ['selectorBoxExists',
        'saveSelectorBox', 'resetSelectorBox']);
    const attrServiceMock: SpyObj<AttributesService> = jasmine.createSpyObj('AttributesService', ['']);
    beforeEach(() => {
        selectorServiceMock = new SelectorServiceMock(saveService);
        dragService = new DragService(selectorServiceMock, gridService);
        TestBed.configureTestingModule({
            declarations: [SelectorComponent],
            providers: [
                ToolHandlerService,
                DrawingStorageService,
                SaveService,
                ColourService,
                SelectorService,
                ResizeService,
                { provide: AttributesService, useValue: attrServiceMock, },
            ],
        }).overrideComponent(SelectorComponent, {
            set: {
              providers: [
                { provide: SelectorService, useValue: selectorServiceMock },
                { provide: ResizeService, useValue: resizeServiceMock },
              ],
            },
        }).compileComponents();

        fixture = TestBed.createComponent(SelectorComponent);
        fixture.detectChanges();
        toolServiceMock = TestBed.get(ToolHandlerService);
        selector = fixture.componentInstance;
        // tslint:disable-next-line: no-string-literal
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
        spyOn(dragService, 'dragObjects').and.callThrough();
        resizeServiceMock.resizeAxis.and.callFake(() => { return; });
        resizeServiceMock.resizePosition.and.callFake(() => { return; });
        resizeServiceMock.resizeAxesFromCenter.and.callFake(() => { return; });
        resizeServiceMock.resizeWithAspectRatio.and.callFake(() => { return; });
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

    it('should reset the service on a left click if not dragging', () => {
        const leftClick = new MouseEvent('mousedown', { button: ClickTypes.LEFT_CLICK });
        spyOn(toolServiceMock, 'selectorBoxExists').and.returnValue(false);
        selectorServiceMock.selectedObjects.clear();
        selector.onMouseDown(leftClick);
        expect(selectorServiceMock.resetSelectorService).toHaveBeenCalled();
        spyOn(toolServiceMock, 'selectorBoxExists').and.returnValue(true);
        const controlPointSpy = spyOn(ClickHelper, 'cursorTouchesControlPoint').and.returnValue(ControlPoints.TOP_LEFT);
        selector.onMouseDown(leftClick);
        expect(controlPointSpy).toHaveBeenCalled();
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
        spyOn(toolServiceMock, 'selectorBoxExists').and.returnValue(false);
        selectorServiceMock.selectedObjects.clear();
        selector.onMouseDown(leftClick);
        expect(selectorServiceMock.resetSelectorService).toHaveBeenCalled();
        const leftDrag = new MouseEvent('mousemove');
        selectorServiceMock.selectedObjects.add(drawing);
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
        selectorServiceMock.selectedObjects.clear();
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

    it('test regular resize', () => {
        // tslint:disable: no-magic-numbers
        const resizePositionSpy = spyOn(ResizeService.prototype, 'resizePosition').and.callFake(() => { return; });
        const resizeAxisSpy = spyOn(ResizeService.prototype, 'resizeAxis').and.callFake(() => { return; });
        const leftClick = new MouseEvent('mousedown', { button: ClickTypes.LEFT_CLICK });
        const drag = new MouseEvent('mousemove');
        const selectorBoxExists = spyOn(toolServiceMock, 'selectorBoxExists');
        selectorBoxExists.and.returnValue(true);
        const controlPointSpy = spyOn(ClickHelper, 'cursorTouchesControlPoint');
        spyOn(ClickHelper, 'getXPosition').and.returnValue(FIFTY);
        spyOn(ClickHelper, 'getYPosition').and.returnValue(FIFTY);
        controlPointSpy.and.returnValue(ControlPoints.TOP_LEFT);
        selector.onMouseDown(leftClick);
        selector.onMouseMove(drag);
        expect(resizePositionSpy).toHaveBeenCalled();
        controlPointSpy.and.returnValue(ControlPoints.TOP_MIDDLE);
        selector.onMouseDown(leftClick);
        selector.onMouseMove(drag);
        expect(resizePositionSpy).toHaveBeenCalledTimes(2);
        controlPointSpy.and.returnValue(ControlPoints.TOP_RIGHT);
        selector.onMouseDown(leftClick);
        selector.onMouseMove(drag);
        expect(resizePositionSpy).toHaveBeenCalledTimes(3);
        expect(resizeAxisSpy).toHaveBeenCalled();
        controlPointSpy.and.returnValue(ControlPoints.MIDDLE_LEFT);
        selector.onMouseDown(leftClick);
        selector.onMouseMove(drag);
        expect(resizePositionSpy).toHaveBeenCalledTimes(4);
        controlPointSpy.and.returnValue(ControlPoints.MIDDLE_RIGHT);
        selector.onMouseDown(leftClick);
        selector.onMouseMove(drag);
        expect(resizeAxisSpy).toHaveBeenCalledTimes(2);
        controlPointSpy.and.returnValue(ControlPoints.BOTTOM_LEFT);
        selector.onMouseDown(leftClick);
        selector.onMouseMove(drag);
        expect(resizePositionSpy).toHaveBeenCalledTimes(5);
        expect(resizeAxisSpy).toHaveBeenCalledTimes(3);
        controlPointSpy.and.returnValue(ControlPoints.BOTTOM_MIDDLE);
        selector.onMouseDown(leftClick);
        selector.onMouseMove(drag);
        expect(resizeAxisSpy).toHaveBeenCalledTimes(4);
        controlPointSpy.and.returnValue(ControlPoints.BOTTOM_RIGHT);
        selector.onMouseDown(leftClick);
        selector.onMouseMove(drag);
        expect(resizeAxisSpy).toHaveBeenCalledTimes(5);
    });

    it('test resize from center', () => {
        const resizeFromCenterSpy = spyOn(ResizeService.prototype, 'resizeAxesFromCenter').and.callFake(() => { return; });
        const leftClick = new MouseEvent('mousedown', { button: ClickTypes.LEFT_CLICK });
        const drag = new MouseEvent('mousemove');
        const selectorBoxExists = spyOn(toolServiceMock, 'selectorBoxExists');
        selectorBoxExists.and.returnValue(true);
        const controlPointSpy = spyOn(ClickHelper, 'cursorTouchesControlPoint');
        spyOn(ClickHelper, 'getXPosition').and.returnValue(FIFTY);
        spyOn(ClickHelper, 'getYPosition').and.returnValue(FIFTY);
        selector.onAltDown(new KeyboardEvent('keydown.alt'));
        controlPointSpy.and.returnValue(ControlPoints.TOP_LEFT);
        selector.onMouseDown(leftClick);
        selector.onMouseMove(drag);
        expect(resizeFromCenterSpy).toHaveBeenCalled();
        controlPointSpy.and.returnValue(ControlPoints.TOP_MIDDLE);
        selector.onMouseDown(leftClick);
        selector.onMouseMove(drag);
        expect(resizeFromCenterSpy).toHaveBeenCalledTimes(2);
        controlPointSpy.and.returnValue(ControlPoints.TOP_RIGHT);
        selector.onMouseDown(leftClick);
        selector.onMouseMove(drag);
        expect(resizeFromCenterSpy).toHaveBeenCalledTimes(3);
        controlPointSpy.and.returnValue(ControlPoints.MIDDLE_LEFT);
        selector.onMouseDown(leftClick);
        selector.onMouseMove(drag);
        expect(resizeFromCenterSpy).toHaveBeenCalledTimes(4);
        controlPointSpy.and.returnValue(ControlPoints.MIDDLE_RIGHT);
        selector.onMouseDown(leftClick);
        selector.onMouseMove(drag);
        expect(resizeFromCenterSpy).toHaveBeenCalledTimes(5);
        controlPointSpy.and.returnValue(ControlPoints.BOTTOM_LEFT);
        selector.onMouseDown(leftClick);
        selector.onMouseMove(drag);
        expect(resizeFromCenterSpy).toHaveBeenCalledTimes(6);
        controlPointSpy.and.returnValue(ControlPoints.BOTTOM_MIDDLE);
        selector.onMouseDown(leftClick);
        selector.onMouseMove(drag);
        expect(resizeFromCenterSpy).toHaveBeenCalledTimes(7);
        controlPointSpy.and.returnValue(ControlPoints.BOTTOM_RIGHT);
        selector.onMouseDown(leftClick);
        selector.onMouseMove(drag);
        expect(resizeFromCenterSpy).toHaveBeenCalledTimes(8);
    });

    it('test resize with aspect ratio', () => {
        const resizeAspectRatioSpy = spyOn(ResizeService.prototype, 'resizeWithAspectRatio').and.callFake(() => { return; });
        const leftClick = new MouseEvent('mousedown', { button: ClickTypes.LEFT_CLICK });
        const drag = new MouseEvent('mousemove');
        const selectorBoxExists = spyOn(toolServiceMock, 'selectorBoxExists');
        selectorBoxExists.and.returnValue(true);
        const controlPointSpy = spyOn(ClickHelper, 'cursorTouchesControlPoint');
        spyOn(ClickHelper, 'getXPosition').and.returnValue(FIFTY);
        spyOn(ClickHelper, 'getYPosition').and.returnValue(FIFTY);
        selector.onShiftDown();
        controlPointSpy.and.returnValue(ControlPoints.TOP_LEFT);
        selector.onMouseDown(leftClick);
        selector.onMouseMove(drag);
        expect(resizeAspectRatioSpy).toHaveBeenCalled();
        controlPointSpy.and.returnValue(ControlPoints.TOP_RIGHT);
        selector.onMouseDown(leftClick);
        selector.onMouseMove(drag);
        expect(resizeAspectRatioSpy).toHaveBeenCalledTimes(2);
        controlPointSpy.and.returnValue(ControlPoints.BOTTOM_LEFT);
        selector.onMouseDown(leftClick);
        selector.onMouseMove(drag);
        expect(resizeAspectRatioSpy).toHaveBeenCalledTimes(3);
        controlPointSpy.and.returnValue(ControlPoints.BOTTOM_RIGHT);
        selector.onMouseDown(leftClick);
        selector.onMouseMove(drag);
        expect(resizeAspectRatioSpy).toHaveBeenCalledTimes(4);
        // tslint:enable: no-magic-numbers

    });

    it('#leftClick should reset the component and the shape', () => {
        const spyComponent = spyOn<any>(selector, 'resetComponent');
        const spyShape = spyOn<any>(selector, 'resetShape');
        const leftClick = new MouseEvent('mousedown', { button: ClickTypes.LEFT_CLICK });
        selector['leftClick'](leftClick);
        expect(spyComponent).toHaveBeenCalled();
        expect(spyShape).toHaveBeenCalled();
    });

    it('#handleMouseUp should reset component and shape if dragging but size is 0, else drag and add to drawing storage', () => {
        const spyComponent = spyOn<any>(selector, 'resetComponent');
        const spyShape = spyOn<any>(selector, 'resetShape');
        selector['shouldDrag'] = true;
        selectorServiceMock.selectedObjects.clear();
        const leftClick = new MouseEvent('mouseup', { button: ClickTypes.LEFT_CLICK });
        selector['handleMouseUp'](leftClick);
        expect(spyComponent).toHaveBeenCalled();
        expect(spyShape).toHaveBeenCalled();
    });

    it('#handleMouseMove should reset selector service if not dragging and size is 0', () => {
        selector['mouseDown'] = true;
        selector['shouldDrag'] = false;
        selectorServiceMock.selectedObjects.clear();
        const leftClick = new MouseEvent('mouseDown', { button: ClickTypes.LEFT_CLICK });
        selector['handleMouseMove'](leftClick);
        expect(selectorServiceMock.resetSelectorService).toHaveBeenCalled();
    });

    it('#leftClick should do nothing if the cursor does not touch a drawing', () => {
        TestBed.get(DrawingStorageService).drawings = [{ x: FIFTY, y: FIFTY, width: FIFTY, height: FIFTY, id: Id.RECTANGLE }];
        const spyTrace = spyOn<any>(selector, 'traceBox');
        selector['mouseDown'] = true;
        selector['shouldDrag'] = false;
        selectorServiceMock.selectedObjects.clear();
        spyOn(selectorServiceMock, 'cursorTouchesObject').and.returnValue(false);
        const leftClick = new MouseEvent('mouseDown', { button: ClickTypes.LEFT_CLICK });
        selector['leftClick'](leftClick);
        expect(spyTrace).not.toHaveBeenCalled();
        expect(selectorServiceMock.setBoxToDrawing).not.toHaveBeenCalled();
    });

    it('#rightClick should do nothing if the cursor does not touch a drawing', () => {
        TestBed.get(DrawingStorageService).drawings = [{ x: FIFTY, y: FIFTY, width: FIFTY, height: FIFTY, id: Id.RECTANGLE }];
        const spyTrace = spyOn<any>(selector, 'traceBox');
        selector['mouseDown'] = true;
        selector['shouldDrag'] = false;
        selectorServiceMock.selectedObjects.clear();
        spyOn(selectorServiceMock, 'cursorTouchesObject').and.returnValue(false);
        const rightClick = new MouseEvent('mouseDown', { button: ClickTypes.LEFT_CLICK });
        selector['rightClick'](rightClick);
        expect(spyTrace).not.toHaveBeenCalled();
        expect(selectorServiceMock.setBoxToDrawing).not.toHaveBeenCalled();
    });

});
