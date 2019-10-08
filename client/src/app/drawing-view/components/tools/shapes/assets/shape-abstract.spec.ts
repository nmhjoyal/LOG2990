
import SpyObj = jasmine.SpyObj;
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
import { ShapeAbstract } from './shape-abstract';

class ShapeTest extends ShapeAbstract {

  constructor(serviceInstance: ToolHandlerService) {
    super(serviceInstance);
  }

  // mock of abstract methods
  saveShape(): void {
    return;
  }

  calculateDimensions(): void {
    return;
  }
}

describe('ShapeAbstract', () => {
  let ShapeTest: ShapeTest;
  let storage: SpyObj<ToolHandlerService>;
  beforeEach(() => {
    ShapeTest = new ShapeTest(storage);
  });

  it('should create an instance of the derived class', () => {
    expect(new ShapeTest()).toBeTruthy();
  });

  // Tests of event handling methods

  it('should call onMouseDown when left mouse button is pressed', () => {
    const spy = spyOn(ShapeTest, 'onMouseDown');
    const event = new MouseEvent('mousedown');
    dispatchEvent(event);
    // ShapeTest.onMouseDown(event);
    expect(spy).toHaveBeenCalled();
  });

  it('should call onMouseUp when left mouse button gets released', () => {
    const spy = spyOn(ShapeTest, 'onMouseUp');
    const event = new MouseEvent('mouseup');
    dispatchEvent(event);
    expect(spy).toHaveBeenCalled();
  });

  it('should call onMouseLeave cursor leaves the window', () => {
    const spy = spyOn(ShapeTest, 'onMouseLeave');
    const event = new MouseEvent('mouseleave');
    dispatchEvent(event);
    expect(spy).toHaveBeenCalled();
  });

  it('should call onMouseMove cursor moves on the window', () => {
    const spy = spyOn(ShapeTest, 'onMouseMove');
    const event = new MouseEvent('mousemove');
    dispatchEvent(event);
    expect(spy).toHaveBeenCalled();
  });

  it('should call onShiftUp cursor moves on the window', () => {
    const spy = spyOn(ShapeTest, 'onShiftUp');
    const event = new KeyboardEvent('keyup.shift');
    dispatchEvent(event);
    expect(spy).toHaveBeenCalled();
  });

  it('should call onShiftDown cursor moves on the window', () => {
    const spy = spyOn(ShapeTest, 'onShiftDown');
    const event = new KeyboardEvent('keydown.shift');
    dispatchEvent(event);
    expect(spy).toHaveBeenCalled();
  });

  it('should call onMouseUp when mousedown is true and mouse leaves', () => {
    const spy = spyOn(ShapeTest, 'onMouseUp');
    const mouseDownEvent = new MouseEvent('mousedown');
    ShapeTest.onMouseDown(mouseDownEvent);
    ShapeTest.onMouseLeave();
    expect(spy).toHaveBeenCalled();
  });

  it('should calculate the shape\'s dimensions when the mouse is getting dragged', () => {
    const spy = spyOn(ShapeTest, 'calculateDimensions');
    const mouseDownEvent = new MouseEvent('mousedown');
    const mouseMoveEvent = new MouseEvent('mousemove');

    ShapeTest.onMouseDown(mouseDownEvent);
    ShapeTest.onMouseMove(mouseMoveEvent);
    expect(spy).toHaveBeenCalled();
  });

  it('should recalculate the shape\'s dimensions when the mouse and the shift button are pressed', () => {
    const spy = spyOn(ShapeTest, 'calculateDimensions');
    const mouseDownEvent = new MouseEvent('mousedown');

    ShapeTest.onMouseDown(mouseDownEvent);
    ShapeTest.onShiftDown();
    expect(spy).toHaveBeenCalled();
  });

  it('should recalculate the shape\'s dimensions when the mousebutton is pressed and the shift button is released', () => {
    const spy = spyOn(ShapeTest, 'calculateDimensions');
    const mouseDownEvent = new MouseEvent('mousedown');

    ShapeTest.onMouseDown(mouseDownEvent);
    ShapeTest.onShiftUp();
    expect(spy).toHaveBeenCalled();
  });

  it('should call saveShape when mouse has been dragged and is then released', () => {
    const spy = spyOn(ShapeTest, 'saveShape');
    const mouseDownEvent = new MouseEvent('mousedown');
    const mouseMoveEvent = new MouseEvent('mousemove');

    ShapeTest.onMouseDown(mouseDownEvent);
    ShapeTest.onMouseMove(mouseMoveEvent); // How to controle the data in the event? To only call saveshape when movement is positive
    ShapeTest.onMouseUp();
    expect(spy).toHaveBeenCalled();
  });

  // Tests of Functions

});
