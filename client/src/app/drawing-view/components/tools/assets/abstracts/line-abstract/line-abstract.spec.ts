
import SpyObj = jasmine.SpyObj;
import { Component, DebugElement, OnDestroy, OnInit } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { DrawingViewModule } from 'src/app/drawing-view/drawing-view.module';
import { ColourService } from 'src/app/services/colour_service/colour.service';
import { DrawingStorageService } from 'src/app/services/drawing-storage/drawing-storage.service';
import { LineComponent } from '../../../shapes/line/line.component';
import { AttributesService } from '../../attributes/attributes.service';
import { LineAbstract } from './line-abstract';

@Component({
    selector: 'test-line-abstract',
    template: '<svg points = "" ><\svg>',
  })
class LineTestComponent extends LineAbstract implements OnInit, OnDestroy {

  constructor(serviceInstance: DrawingStorageService, attributesInstance: AttributesService, colourInstance: ColourService) {
    super(serviceInstance, attributesInstance, colourInstance);
  }

  // mock of abstract methods
  ngOnInit(): void {
      // empty block
  }

  ngOnDestroy(): void {
      // empty block
  }

  saveAttribute(): void {
    // empty block
}

  saveSegment(): void {
    // empty block
  }

  addSegment(): void {
      // empty block
  }
}

describe('LineAbstract', () => {
  let component: LineComponent;
  let shapeTest: LineTestComponent;
  let hostElement: DebugElement;
  let drawingServiceMock: SpyObj<DrawingStorageService>;
  let fixture: ComponentFixture<LineTestComponent>;

  const attrServiceMock: SpyObj<AttributesService> = jasmine.createSpyObj('AttributesService', ['']);
  beforeEach(() => {
    drawingServiceMock = jasmine.createSpyObj('DrawingStorageService', ['saveDrawing']);

    TestBed.configureTestingModule({
        imports: [BrowserDynamicTestingModule, DrawingViewModule],
        declarations: [LineTestComponent],
        providers: [
          { provide: DrawingStorageService, useValue: drawingServiceMock, },
          { provide: AttributesService, useValue: attrServiceMock, },
        ],
      });

      fixture = TestBed.createComponent(LineTestComponent);
      fixture.detectChanges();
      component = fixture.componentInstance;

      shapeTest = fixture.componentInstance;
      hostElement = fixture.debugElement;
});

  it('should create an instance of the derived class', () => {
    expect(shapeTest).toBeTruthy();
  });

  // Tests of event handling methods
  // tslint:disable: no-any

  it('#onMouseDown should be called when left mouse button is pressed', () => {
    const spy = spyOn(shapeTest, 'onMouseDown');
    const event = new MouseEvent('mousedown');

    hostElement.triggerEventHandler('mousedown', event);

    expect(spy).toHaveBeenCalled();
  });

  it('#onMouseMove should be called when the cursor moves on the window', () => {
    const spy = spyOn(shapeTest, 'onMouseMove');
    const event = new MouseEvent('mousemove');

    hostElement.triggerEventHandler('mousemove', event);

    expect(spy).toHaveBeenCalled();
  });

  it('#onShiftUp should be called when the shift button is released', () => {
    const spy = spyOn(shapeTest, 'onShiftUp');
    const event = new KeyboardEvent('keyup.shift');

    hostElement.triggerEventHandler('keyup.shift', event);

    expect(spy).toHaveBeenCalled();
  });

  it('#onShiftDown should be called when the shift button is pressed', () => {
    const spy = spyOn(shapeTest, 'onShiftDown');
    const event = new KeyboardEvent('keydown.shift');

    hostElement.triggerEventHandler('keydown.shift', event);

    expect(spy).toHaveBeenCalled();
  });

  it('#onDoubleClick should be called when the mouse button is doubled clicked', () => {
    const spy = spyOn(shapeTest, 'onDoubleClick');
    const event = new KeyboardEvent('dblclick');

    hostElement.triggerEventHandler('dblclick', event);

    expect(spy).toHaveBeenCalled();
  });

  it('#onEscape should be called when the escape button is pressed', () => {
    const spy = spyOn(shapeTest, 'onEscape');
    const event = new KeyboardEvent('keydown.esc');

    hostElement.triggerEventHandler('keydown.esc', event);

    expect(spy).toHaveBeenCalled();
  });

  it('#onShiftDown should put shiftDown to true', () => {
    const event = new KeyboardEvent('keydown.shift');
    hostElement.triggerEventHandler('keydown.shift', event);
    expect((component as any).shiftDown).toEqual(true);
  });

  it('#onShiftUp should put shiftDown to false', () => {
    const event = new KeyboardEvent('keyup.shift');
    hostElement.triggerEventHandler('keyup.shift', event);
    expect((component as any).shiftDown).toEqual(false);
  });

  it('#onDelete should be called when the backspace button is pressed', () => {
    const spy = spyOn(shapeTest, 'onDelete');
    const event = new KeyboardEvent('keydown.backspace');

    hostElement.triggerEventHandler('keydown.backspace', event);

    expect(spy).toHaveBeenCalled();
  });

  it('#onMouseDown should call #addSegment if started is true', () => {
    const spy = spyOn(shapeTest, 'addSegment');
    (component as any).started = true;
    const mouseDownEvent = new MouseEvent('mousedown');
    shapeTest.onMouseMove(mouseDownEvent);
    hostElement.triggerEventHandler('mousedown', mouseDownEvent);
    expect(spy).toHaveBeenCalled();
  });

  it('#onMouseDown should put started to true', () => {
    (component as any).started = false;
    const mouseDownEvent = new MouseEvent('mousedown');
    shapeTest.onMouseMove(mouseDownEvent);
    hostElement.triggerEventHandler('mousedown', mouseDownEvent);
    expect((component as any).started).toEqual(true);
  });

  it('#onDoubleClick should call #saveSegment if started is true', () => {
    const spy = spyOn(shapeTest, 'saveSegment');
    (component as any).started = true;
    const mouseDownEvent = new MouseEvent('dblclick');
    shapeTest.onDoubleClick();
    shapeTest.onMouseMove(mouseDownEvent);
    expect(spy).toHaveBeenCalled();
  });

  it('#onDoubleClick should call #addSegment if started is true', () => {
    const spy = spyOn(shapeTest, 'addSegment');
    (component as any).started = true;
    const mouseDownEvent = new MouseEvent('dblclick');
    shapeTest.onDoubleClick();
    shapeTest.onMouseMove(mouseDownEvent);
    expect(spy).toHaveBeenCalled();
  });

  it('#onDelete should delete last segment from array', () => {
    (component as any).previewPoints = ['', ''];
    const length = (component as any).previewPoints.length;
    const event = new KeyboardEvent('keyup.backspace');
    hostElement.triggerEventHandler('keyup.backspace', event);
    shapeTest.onDelete();
    expect((component as any).previewPoints.length).toEqual(length - 1);
  });

});
