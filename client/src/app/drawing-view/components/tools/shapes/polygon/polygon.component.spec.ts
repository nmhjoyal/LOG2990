import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { SaveService } from 'src/app/services/save-service/save.service';
import { ShapeAbstract } from '../../assets/abstracts/shape-abstract/shape-abstract';
import { AttributesService } from '../../assets/attributes/attributes.service';
import { ToolConstants } from '../../assets/constants/tool-constants';
import { PolygonComponent } from './polygon.component';

const STROKE_WIDTH = 100;
const INITIAL_X = 150;
const INITIAL_Y = 200;
const CURSOR_X = 550;
const CURSOR_Y = 700;
const VERTEX_NUMBER = 6;

describe('PolygonComponent', () => {
  let component: PolygonComponent;
  let attrService: AttributesService;
  let fixture: ComponentFixture<PolygonComponent>;
  const saveServiceMock: jasmine.SpyObj<SaveService> = jasmine.createSpyObj('SaveService', ['saveDrawing']);
  const attributesServiceMock: AttributesService = new AttributesService();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserDynamicTestingModule],
      declarations: [PolygonComponent],
      providers: [
        { provide: SaveService, useValue: saveServiceMock, },
        { provide: AttributesService, useValue: attributesServiceMock, },
      ],
    })
      .compileComponents();
  }));

  // tslint:disable:no-string-literal
  beforeEach(() => {
    fixture = TestBed.createComponent(PolygonComponent);
    attrService = TestBed.get(AttributesService); // could use a property spy...
    component = fixture.componentInstance;
    fixture.detectChanges();

    component['initialX'] = INITIAL_X;
    component['initialY'] = INITIAL_Y;
    component['cursorX'] = CURSOR_X;
    component['cursorY'] = CURSOR_Y;
    component['mouseDown'] = true;

  });

  afterEach(() => {
    fixture.destroy();
    attrService.resetSavedAttributes();
  });

  it('should create correctly', () => {
    expect(component).toBeTruthy();
    expect(component['shape'].verticesNumber).toBeDefined('verticeNumber of shapes is undefined');
  });

  it('#ngOnInit should not load strokewidth and trace mode if there are no attributes saved in the service', () => {
    attrService.polygonAttributes.wasSaved = false;
    attrService.polygonAttributes.savedTraceMode = ToolConstants.TRACE_MODE.CONTOUR;
    attrService.polygonAttributes.savedStrokeWidth = STROKE_WIDTH;
    attrService.polygonAttributes.savedVerticesNumber = 0;

    component.ngOnInit();
    expect(component['shape'].strokeWidth).toEqual(ToolConstants.DEFAULT_STROKE_WIDTH,
      'no loading of attributes, yet strokeWidth did not take default value');
    expect(component['traceMode']).toEqual(ToolConstants.TRACE_MODE.CONTOUR_FILL,
      'no loading of attributes, yet traceMode did not take correct default value');
    expect(component['shape'].verticesNumber).toEqual(ToolConstants.MIN_VERTEX_NUMBER,
      'did not load minimum vertex number value at loadless initialisation');
  });

  it('#ngOnInit should load strokewidth and trace mode if there are attributes saved in the service', () => {
    attrService.polygonAttributes.wasSaved = true;
    attrService.polygonAttributes.savedTraceMode = ToolConstants.TRACE_MODE.CONTOUR;
    attrService.polygonAttributes.savedStrokeWidth = STROKE_WIDTH;
    attrService.polygonAttributes.savedVerticesNumber = VERTEX_NUMBER;

    component.ngOnInit();

    expect(component['shape'].strokeWidth).toEqual(STROKE_WIDTH,
      'loading of attributes, yet strokeWidth did not take saved value');
    expect(component['traceMode']).toEqual(ToolConstants.TRACE_MODE.CONTOUR,
      'loading of attributes, yet traceMode did not take saved value');
    expect(component['shape'].verticesNumber).toEqual(VERTEX_NUMBER,
      'did not load VERTEC_NUMBER value at loady initialisation');

  });

  it('#ngOnDestroy should save the current attributes in the polygonAttributes interface of the service', () => {
    component.ngOnDestroy();
    expect(attrService.polygonAttributes.savedStrokeWidth).toEqual(ToolConstants.DEFAULT_STROKE_WIDTH,
      'shape.strokeWidth was not successfully saved upon destruction');
    expect(attrService.polygonAttributes.savedTraceMode).toEqual(ToolConstants.TRACE_MODE.CONTOUR_FILL,
      'the traceMode was not successfully saved upon destruction');
    expect(attrService.polygonAttributes.wasSaved).toBe(true, '#ngOnDestroy did not set wasSaved to true');
    expect(attrService.polygonAttributes.savedVerticesNumber).toEqual(ToolConstants.MIN_VERTEX_NUMBER,
      'the seleced number of vertices was not succesfully saved upon destruction');

  });

  it('#calculateDimensions should calculate calculate the radius of the invisible circle that holds the polygon', () => {
    component.onShiftDown(); // to call protected calculateDimensions()
    const expectedResult = ((CURSOR_X - INITIAL_X) / 2) - component['shape'].strokeWidth;
    expect(component['shape'].height).toBe(expectedResult,
    'the radius stored in shape.width and height did not match test math-result expectation');
  });

  it('#calculateDimensions should not generate the vertices of the polygon if the radius - strokewidth <= 0', () => {
    component['shape'].strokeWidth = STROKE_WIDTH; // radius will be (CURSOR_X - INITIALX)/2 - STROKEWIDTH = 100
    component.onShiftDown();
    expect(component['shape'].vertices).toEqual('',
    'vertices were loaded into shapes when they shouldn\'t have been calculated ');
  });

  it('#calculateDimensions should generate the vertices of the polygon if the radius > strokeWidth', () => {
    component.onShiftDown(); // radius will be (CURSOR_X - INITIALX)/2 - ToolConstants.DEFAULT_STROKE_WIDTH = 98
    expect(component['shape'].vertices).not.toEqual('', 'vertices were not loaded into shapes when calculated ');
  });

  it('#increaseVertexNumber should increment shape.vertexNumber while it has not reached the maximum value', () => {
    component['shape'].verticesNumber = VERTEX_NUMBER;
    const expectedResult = VERTEX_NUMBER + 1;
    component.increaseVertexNumber();
    expect(component['shape'].verticesNumber).toBe(expectedResult, 'did not increment shape.verticesNumber');

    component['shape'].verticesNumber = ToolConstants.MAX_VERTEX_NUMBER;
    component.increaseVertexNumber();
    expect(component['shape'].verticesNumber).toBe(ToolConstants.MAX_VERTEX_NUMBER,
      '#increaseVertexNumber modified shape.verticesNumber when it was already at 12');

  });

  it('#decreaseVertexNumber should reduce shape.verticesNumber while it has not reached the minimum value', () => {
    component['shape'].verticesNumber = VERTEX_NUMBER;
    const expectedResult = VERTEX_NUMBER - 1;
    component.decreaseVertexNumber();
    expect(component['shape'].verticesNumber).toBe(expectedResult, 'did not decrement shape.verticesNumber');

    component['shape'].verticesNumber = ToolConstants.MIN_VERTEX_NUMBER;
    component.decreaseVertexNumber();
    expect(component['shape'].verticesNumber).toBe(ToolConstants.MIN_VERTEX_NUMBER,
      '#decreaseVertexNumber modified shape.verticesNumber when it was already at 3');
  });

  it('#saveShape should not save if vertices were not generated', () => {
    // tslint:disable-next-line:no-any
    const superSaveSpy = spyOn<any>(ShapeAbstract.prototype, 'saveShape');
    component.onMouseUp();
    expect(superSaveSpy).not.toHaveBeenCalled();
  });

  it('#saveShape not save if vertices were not generated', () => {
    component.onShiftUp();
    // tslint:disable-next-line:no-any
    const superSaveSpy = spyOn<any>(ShapeAbstract.prototype, 'saveShape');
    component.onMouseUp();
    expect(superSaveSpy).toHaveBeenCalled();
  });

});
