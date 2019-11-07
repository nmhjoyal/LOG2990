import SpyObj = jasmine.SpyObj;
import { Component, DebugElement, OnDestroy, OnInit } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { DrawingViewModule } from 'src/app/drawing-view/drawing-view.module';
import { ColorService } from 'src/app/services/color_service/color.service';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
import { AttributesService } from '../../attributes/attributes.service';
import { StrokeAbstract } from './stroke-abstract';
import { DrawingStorageService } from 'src/app/services/drawing-storage/drawing-storage.service';

@Component({
    selector: 'test-shape-abstract',
    template: '<svg x=0 y=0 width=1000 height=1000><\svg>',
  })
class StrokeTestComponent extends StrokeAbstract implements OnInit, OnDestroy {

  constructor(serviceInstance: DrawingStorageService, attributesInstance: AttributesService, colorInstance: ColorService) {
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
  saveAttribute(): void {
      // empty block
  }
}

describe('StrokeAbstract', () => {
  let strokeTest: StrokeTestComponent;
  let hostElement: DebugElement;
  let drawingStorageMock: SpyObj<DrawingStorageService>;
  let fixture: ComponentFixture<StrokeTestComponent>;
  const attrServiceMock: SpyObj<AttributesService> = jasmine.createSpyObj('AttributesService', ['']);
  beforeEach(() => {
    drawingStorageMock = jasmine.createSpyObj('DrawingStorageService', ['saveDrawing']);

    TestBed.configureTestingModule({
        imports: [BrowserDynamicTestingModule, DrawingViewModule],
        declarations: [StrokeTestComponent],
        providers: [
          { provide: DrawingStorageService, useValue: drawingStorageMock, },
          { provide: AttributesService, useValue: attrServiceMock, },
        ],
      });

      fixture = TestBed.createComponent(StrokeTestComponent);
      fixture.detectChanges();

      strokeTest = fixture.componentInstance;
      hostElement = fixture.debugElement;
});

  it('should create an instance of the derived class', () => {
    expect(strokeTest).toBeTruthy();
  });

  // Tests of event handling methods

  it('#onMouseDown should be called when left mouse button is pressed', () => {
    const spy = spyOn(strokeTest, 'onMouseDown');
    const event = new MouseEvent('mousedown');

    hostElement.triggerEventHandler('mousedown', event);

    expect(spy).toHaveBeenCalled();
  });

  it('#onMouseUp should be called when left mouse button gets released', () => {
    const spy = spyOn(strokeTest, 'onMouseUp');
    const event = new MouseEvent('mouseup');

    hostElement.triggerEventHandler('mouseup', event);

    expect(spy).toHaveBeenCalled();
  });

  it('#onMouseLeave should be called when the cursor leaves the window', () => {
    const spy = spyOn(strokeTest, 'onMouseLeave');
    const event = new MouseEvent('mouseleave');

    hostElement.triggerEventHandler('mouseleave', event);

    expect(spy).toHaveBeenCalled();
  });

  it('#onMouseMove should be called when the cursor moves on the window', () => {
    const spy = spyOn(strokeTest, 'onMouseMove');
    const event = new MouseEvent('mousemove');

    hostElement.triggerEventHandler('mousemove', event);

    expect(spy).toHaveBeenCalled();
  });

  it('#onMouseLeave should call #onMouseUp if mousedown is true', () => {
    const spy = spyOn(strokeTest, 'onMouseUp');
    const mouseDownEvent = new MouseEvent('mousedown');
    strokeTest.onMouseDown(mouseDownEvent);

    const mouseLeaveEvent = new MouseEvent('mouseleave');
    strokeTest.onMouseLeave(mouseLeaveEvent);

    expect(spy).toHaveBeenCalled();
  });

  it('#onMouseUp should call #saveShape when the mouse was initially pressed and a shape\'s dimensions was calculated', () => {
    const spy = spyOn(strokeTest, 'saveShape');

    const mouseDownEvent = new MouseEvent('mousedown');
    strokeTest.onMouseDown(mouseDownEvent);

    const PRESET_POINTS = '10,10 20,20';

    // tslint:disable:no-string-literal
    strokeTest['stroke'].points = PRESET_POINTS;
    // tslint:enable:no-string-literal

    const mouseUpEvent = new MouseEvent('mouseup');
    strokeTest.onMouseUp(mouseUpEvent);

    expect(spy).toHaveBeenCalled();
  });

  // Tests of Functions and verify attributes value changes in eventhandlers
});
