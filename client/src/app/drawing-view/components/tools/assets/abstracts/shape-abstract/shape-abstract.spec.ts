
import SpyObj = jasmine.SpyObj;
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
import { ShapeAbstract } from './shape-abstract';
import { AttributesService } from '../../attributes/attributes.service';

class ShapeTest extends ShapeAbstract {

  constructor(serviceInstance: ToolHandlerService, attributesInstance: AttributesService) {
    super(serviceInstance, attributesInstance);
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
      //empty block
  }
}

describe('ShapeAbstract', () => {
  let shapeTest: ShapeTest;
  let toolHandlerMock: SpyObj<ToolHandlerService>;
  const attrServiceMock: SpyObj<AttributesService> = jasmine.createSpyObj('AttributesService', ['']);
  beforeEach(() => {
    toolHandlerMock = jasmine.createSpyObj('ToolHandlerService', ['']); // service method that saves drawing operation
    shapeTest = new ShapeTest(toolHandlerMock, attrServiceMock);
  });

  it('should create an instance of the derived class', () => {
    expect(shapeTest).toBeTruthy();
  });

  // Tests of event handling methods

  it('#onMouseDown should be called when left mouse button is pressed', () => {
    const spy = spyOn(shapeTest, 'onMouseDown');
    const event = new MouseEvent('mousedown');
    dispatchEvent(event);
    expect(spy).toHaveBeenCalled();
  });

  it('#onMouseUp should be called when left mouse button gets released', () => {
    const spy = spyOn(shapeTest, 'onMouseUp');
    const event = new MouseEvent('mouseup');
    dispatchEvent(event);
    expect(spy).toHaveBeenCalled();
  });

  it('#onMouseLeave should be called when the cursor leaves the window', () => {
    const spy = spyOn(shapeTest, 'onMouseLeave');
    const event = new MouseEvent('mouseleave');
    dispatchEvent(event);
    expect(spy).toHaveBeenCalled();
  });

  it('#onMouseMove should be called when the cursor moves on the window', () => {
    const spy = spyOn(shapeTest, 'onMouseMove');
    const event = new MouseEvent('mousemove');
    dispatchEvent(event);
    expect(spy).toHaveBeenCalled();
  });

  it('#onShiftUp should be called when the shift button is released', () => {
    const spy = spyOn(shapeTest, 'onShiftUp');
    const event = new KeyboardEvent('keyup.shift');
    dispatchEvent(event);
    expect(spy).toHaveBeenCalled();
  });

  it('#onShiftDown should be called when the shift button is pressed', () => {
    const spy = spyOn(shapeTest, 'onShiftDown');
    const event = new KeyboardEvent('keydown.shift');
    dispatchEvent(event);
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

  it('#onMouseUp should call #saveShape when the mouse was dragged and is then released', () => {
    const spy = spyOn(shapeTest, 'saveShape');
    const mouseDownEvent = new MouseEvent('mousedown');
    const mouseMoveEvent = new MouseEvent('mousemove');

    shapeTest.onMouseDown(mouseDownEvent);
    shapeTest.onMouseMove(mouseMoveEvent); // How to controle the data in the event? To only call saveshape when movement is positive
    shapeTest.onMouseUp();
    expect(spy).toHaveBeenCalled();
  });

  // Tests of Functions
// A METTRE DANS LE TEST DE CALCULATE DIMENSIONS expect(component["shape"].width).toBe(component["previewBox"].width - STROKEWIDTH, "width unchanged when it is the smallest value");
});
