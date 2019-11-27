// tslint:disable:no-string-literal
// tslint:disable:no-magic-numbers
// tslint:disable:no-any
import SpyObj = jasmine.SpyObj;
import { Component, DebugElement, OnDestroy, OnInit } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { DrawingViewModule } from 'src/app/drawing-view/drawing-view.module';
import { ColourService } from 'src/app/services/colour_service/colour.service';
import { SaveService } from 'src/app/services/save-service/save.service';
import { AttributesService } from '../../attributes/attributes.service';
import { StrokeAbstract } from './stroke-abstract';
import ClickHelper from 'src/app/helpers/click-helper/click-helper';

const STROKE_WIDTH = 15;

@Component({
    selector: 'test-shape-abstract',
    template: '<svg x=0 y=0 width=1000 height=1000><\svg>',
  })
class StrokeTestComponent extends StrokeAbstract implements OnInit, OnDestroy {

  constructor(serviceInstance: SaveService, attributesInstance: AttributesService, colourInstance: ColourService) {
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
     super.saveShape();
  }
  saveAttribute(): void {
      // empty block
  }
}

describe('StrokeAbstract', () => {
  let strokeTest: StrokeTestComponent;
  let hostElement: DebugElement;
  let saveServiceMock: SpyObj<SaveService>;
  let fixture: ComponentFixture<StrokeTestComponent>;
  const attrServiceMock: SpyObj<AttributesService> = jasmine.createSpyObj('AttributesService', ['']);
  beforeEach(() => {
    saveServiceMock = jasmine.createSpyObj('SaveService', ['saveDrawing']);

    TestBed.configureTestingModule({
        imports: [BrowserDynamicTestingModule, DrawingViewModule],
        declarations: [StrokeTestComponent],
        providers: [
          { provide: SaveService, useValue: saveServiceMock, },
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

    strokeTest['stroke'].points = PRESET_POINTS;

    const mouseUpEvent = new MouseEvent('mouseup');
    strokeTest.onMouseUp(mouseUpEvent);

    expect(spy).toHaveBeenCalled();
  });

  it('#onMouseMove should add the x and y position to stroke.points if mouseDown is true', () => {
    const mouseMoveEvent = new MouseEvent('mousemove');
    const getXPosSpy = spyOn(ClickHelper, 'getXPosition').and.callFake(() => {
      return 10;
    });
    const getYPosSpy = spyOn(ClickHelper, 'getYPosition').and.callFake(() => {
      return 20;
    });

    strokeTest['stroke'].points = '';
    strokeTest['mouseDown'] = false;
    strokeTest.onMouseMove(mouseMoveEvent);
    expect(strokeTest['stroke'].points).toEqual('');

    strokeTest['mouseDown'] = true;
    strokeTest.onMouseMove(mouseMoveEvent);
    expect(strokeTest['stroke'].points).toEqual(' 10,20');

    expect(getXPosSpy).toHaveBeenCalled();
    expect(getYPosSpy).toHaveBeenCalled();
  });

  it('#decreaseStrokeWidth should decrease stroke.stroke-width if it is greater than 1', () => {
    strokeTest['stroke'].strokeWidth = 1;
    (strokeTest as any).decreaseStrokeWidth();
    expect(strokeTest['stroke'].strokeWidth).toEqual(1, 'strokeWidth didnt change because it is not greater than 1');

    strokeTest['stroke'].strokeWidth = STROKE_WIDTH;
    strokeTest['decreaseStrokeWidth']();
    expect(strokeTest['stroke'].strokeWidth).toEqual(STROKE_WIDTH - 1, 'strokeWidth was decremented by 1');

    strokeTest['stroke'].strokeWidth = STROKE_WIDTH;
    strokeTest['increaseStrokeWidth']();
    expect(strokeTest['stroke'].strokeWidth).toEqual(STROKE_WIDTH + 1, 'strokeWidth was incremented by 1');
  });

  it('#saveShape should call drawingStorage.saveDrawing', () => {
    const savingSpy = spyOn(strokeTest['drawingStorage'], 'saveDrawing');
    (strokeTest as any).saveShape();
    expect(savingSpy).toHaveBeenCalled();
  });

});
