import SpyObj = jasmine.SpyObj;
import { Component, DebugElement, OnDestroy, OnInit } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { DrawingViewModule } from 'src/app/drawing-view/drawing-view.module';
import { ColourService } from 'src/app/services/colour_service/colour.service';
import { DrawingStorageService } from 'src/app/services/drawing-storage/drawing-storage.service';
import { AttributesService } from '../../attributes/attributes.service';
import { ShapeAbstract } from './shape-abstract';

@Component({
    selector: 'test-shape-abstract',
    template: '<svg x=0 y=0 width=1000 height=1000><\svg>',
  })
class ShapeTestComponent extends ShapeAbstract implements OnInit, OnDestroy {

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

  saveShape(): void {
    // empty block
  }

  calculateDimensions(): void {
      // empty block
  }
}

describe('ShapeAbstract', () => {
  let shapeTest: ShapeTestComponent;
  let hostElement: DebugElement;
  let drawingStorageMock: SpyObj<DrawingStorageService>;
  let fixture: ComponentFixture<ShapeTestComponent>;
  const attrServiceMock: SpyObj<AttributesService> = jasmine.createSpyObj('AttributesService', ['']);

  beforeEach(() => {
    drawingStorageMock = jasmine.createSpyObj('DrawingStorageService', ['saveDrawing']);
    TestBed.configureTestingModule({
        imports: [BrowserDynamicTestingModule, DrawingViewModule],
        declarations: [ShapeTestComponent],
        providers: [
          { provide: DrawingStorageService, useValue: drawingStorageMock, },
          { provide: AttributesService, useValue: attrServiceMock, },
        ],
      });

      fixture = TestBed.createComponent(ShapeTestComponent);
      fixture.detectChanges();

      shapeTest = fixture.componentInstance;
      hostElement = fixture.debugElement;
});

  it('should create an instance of the derived class', () => {
    expect(shapeTest).toBeTruthy();
  });

  // Tests of event handling methods

  it('#onMouseDown should be called when left mouse button is pressed', () => {
    const spy = spyOn(shapeTest, 'onMouseDown');
    const event = new MouseEvent('mousedown');

    hostElement.triggerEventHandler('mousedown', event);

    expect(spy).toHaveBeenCalled();
  });

  it('#onMouseUp should be called when left mouse button gets released', () => {
    const spy = spyOn(shapeTest, 'onMouseUp');
    const event = new MouseEvent('mouseup');

    hostElement.triggerEventHandler('mouseup', event);

    expect(spy).toHaveBeenCalled();
  });

  it('#onMouseLeave should be called when the cursor leaves the window', () => {
    const spy = spyOn(shapeTest, 'onMouseLeave');
    const event = new MouseEvent('mouseleave');

    hostElement.triggerEventHandler('mouseleave', event);

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

  it('#onMouseLeave should call #onMouseUp if mousedown is true', () => {
    const spy = spyOn(shapeTest, 'onMouseUp');
    const mouseDownEvent = new MouseEvent('mousedown');
    shapeTest.onMouseDown(mouseDownEvent);
    shapeTest.onMouseLeave();
    expect(spy).toHaveBeenCalled();
  });

  it('#onMouseMove should call #calculateDimensions the mouse button is pressed', () => {
    const spy = spyOn(shapeTest, 'calculateDimensions');
    const mouseDownEvent = new MouseEvent('mousedown');
    const mouseMoveEvent = new MouseEvent('mousemove');

    shapeTest.onMouseDown(mouseDownEvent);
    shapeTest.onMouseMove(mouseMoveEvent);
    expect(spy).toHaveBeenCalled();
  });

  it('#onShiftDown should call #calculateDimensions when the mouse is pressed', () => {
    const spy = spyOn(shapeTest, 'calculateDimensions');
    const mouseDownEvent = new MouseEvent('mousedown');

    shapeTest.onMouseDown(mouseDownEvent);
    shapeTest.onShiftDown();
    expect(spy).toHaveBeenCalled();
  });

  it('#onShiftUp should call #calculateDimensions when the mousebutton is pressed', () => {
    const spy = spyOn(shapeTest, 'calculateDimensions');
    const mouseDownEvent = new MouseEvent('mousedown');

    shapeTest.onMouseDown(mouseDownEvent);
    shapeTest.onShiftUp();
    expect(spy).toHaveBeenCalled();
  });

  it('#onMouseUp should call #saveShape when the mouse was initially pressed and a shape\'s dimensions was calculated', () => {
    const spy = spyOn(shapeTest, 'saveShape');
    const mouseDownEvent = new MouseEvent('mousedown');
    shapeTest.onMouseDown(mouseDownEvent);

    const PRESET_WIDTH = 100;
    const PRESET_HEIGHT = 200;

    // tslint:disable:no-string-literal
    shapeTest['shape'].width = PRESET_WIDTH;
    shapeTest['shape'].height = PRESET_HEIGHT;
    // tslint:enable:no-string-literal

    shapeTest.onMouseUp();
    expect(spy).toHaveBeenCalled();
  });

  // Tests of Functions and verify attributes value changes in eventhandlers
});
