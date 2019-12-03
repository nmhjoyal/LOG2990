// tslint:disable: no-string-literal
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CanvasInformationService } from 'src/app/services/canvas-information/canvas-information.service';
import { ExportInformationService } from 'src/app/services/export-information/export-information.service';
import { SaveService } from 'src/app/services/save-service/save.service';
import { AttributesService } from '../../assets/attributes/attributes.service';
import { ToolConstants } from '../../assets/constants/tool-constants';
import { BucketComponent } from './bucket.component';

const STROKE_WIDTH = 2;
const TOLERANCE = 25;
const MAX_HEIGHT = 255;
const IN_CANVAS = 25;

describe('BucketComponent', () => {
  let component: BucketComponent;
  let attrService: AttributesService;
  let fixture: ComponentFixture<BucketComponent>;
  const saveServiceMock: jasmine.SpyObj<SaveService> = jasmine.createSpyObj('SaveService', ['saveDrawing']);
  const attributesServiceMock: AttributesService = new AttributesService();
  const canvasDataMock: jasmine.SpyObj<CanvasInformationService> = jasmine.createSpyObj('CanvasInformationService', ['']);
  const exportDataMock: jasmine.SpyObj<ExportInformationService> = jasmine.createSpyObj('ExportInformationService', ['']);

  canvasDataMock.data = {
    drawingColour: '',
    drawingHeight: 0,
    drawingWidth: 0,
  };

  exportDataMock.data = jasmine.createSpyObj('IExportData', ['']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BucketComponent],
      imports: [BrowserAnimationsModule],
      providers: [
        { provide: SaveService, useValue: saveServiceMock, },
        { provide: AttributesService, useValue: attributesServiceMock, },
        { provide: CanvasInformationService, useValue: canvasDataMock },
      ],
    })
      .compileComponents();
  }));
    // tslint:disable:no-string-literal

  beforeEach(() => {
    fixture = TestBed.createComponent(BucketComponent);
    attrService = TestBed.get(AttributesService);
    component = fixture.componentInstance;
    fixture.detectChanges();
    exportDataMock.data.canvasElement = jasmine.createSpyObj('ElementRef<SVGElement>', ['']);
  });

  afterEach(() => {
    fixture.destroy();
    attrService.resetSavedAttributes();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#ngOnDestroy should save the current attributes in the bucketAttributes interface of the service', () => {
    component.ngOnDestroy();
    expect(attrService.bucketAttributes.savedStrokeWidth).toEqual(ToolConstants.DEFAULT_STROKE_WIDTH,
      'shape.strokeWidth was not successfully saved upon destruction');
    expect(attrService.bucketAttributes.savedTraceMode).toEqual(ToolConstants.TRACE_MODE.CONTOUR_FILL,
      'the traceMode was not successfully saved upon destruction');
    expect(attrService.bucketAttributes.wasSaved).toBe(true, '#ngOnDestroy did not set wasSaved to true');
    expect(attrService.bucketAttributes.savedTolerance).toEqual(ToolConstants.DEFAULT_TOLERANCE,
      'the tolerance was not succesfully saved upon destruction');
  });

  it('should properly save the attributes', () => {
    component.ngOnDestroy();
    expect(attrService.bucketAttributes.savedStrokeWidth).toEqual(ToolConstants.DEFAULT_STROKE_WIDTH,
      'stroke.strokeWidth was not successfully saved upon destruction');
    expect(attrService.bucketAttributes.wasSaved).toBe(true, '#ngOnDestroy did not set wasSaved to true');
  });

  it('#ngOnInit should not load strokewidth if there are no attributes saved in the service', () => {
    attrService.bucketAttributes.wasSaved = false;
    attrService.bucketAttributes.savedStrokeWidth = STROKE_WIDTH;

    component.ngOnInit();

    expect(component['shape'].strokeWidth).toEqual(ToolConstants.DEFAULT_STROKE_WIDTH,
      'no loading of attributes, yet strokeWidth did not take default value');
  });

  it('#ngOnInit should load strokewidth and trace mode if there are attributes saved in the service', () => {
    attrService.bucketAttributes.wasSaved = true;
    attrService.bucketAttributes.savedTraceMode = ToolConstants.TRACE_MODE.CONTOUR;
    attrService.bucketAttributes.savedStrokeWidth = STROKE_WIDTH;
    attrService.bucketAttributes.savedTolerance = TOLERANCE;

    component.ngOnInit();

    expect(component['shape'].strokeWidth).toEqual(STROKE_WIDTH,
      'loading of attributes, yet strokeWidth did not take saved value');
    expect(component['traceMode']).toEqual(ToolConstants.TRACE_MODE.CONTOUR,
      'loading of attributes, yet traceMode did not take saved value');
    expect(component['tolerance']).toEqual(TOLERANCE,
      'did not load TOLERANCE value at load initialisation');

  });

  it('#ngOnInit should load strokewidth if there are attributes saved in the service', () => {
    attrService.bucketAttributes.wasSaved = true;
    attrService.bucketAttributes.savedStrokeWidth = STROKE_WIDTH;

    component.ngOnInit();

    expect(component['shape'].strokeWidth).toEqual(STROKE_WIDTH,
      'loading of attributes, yet strokeWidth did not take saved value');
  });

  it('#ngafterviewInit should initialize canvas ', () => {
    const spy = spyOn(component, 'initializeCanvas');
    component.ngAfterViewInit();
    expect(spy).toHaveBeenCalled();
  });

  it('#onMouseDown should call all its functions', () => {
    // const spy = spyOn(component, 'addSurroundingPixels');
    const spy1 = spyOn(component, 'getColourAtPosition');
    // const spy2 = spyOn(component, 'calculateDimensions');
    const spy3 = spyOn(component, 'orderPoints');
    const event = new MouseEvent('mousedown');
    fixture.debugElement.triggerEventHandler('mousedown', event);
    // expect(spy).toHaveBeenCalled();
    expect(spy1).toHaveBeenCalled();
    // expect(spy2).toHaveBeenCalled();
    expect(spy3).toHaveBeenCalled();
  });

  it('getColourAtPosition should not return color when no context', () => {
    expect(component['getColourAtPosition'](MAX_HEIGHT, MAX_HEIGHT)).toEqual([]);
    component['initializeCanvas']();
    expect(component['getColourAtPosition'](MAX_HEIGHT, MAX_HEIGHT)).not.toEqual([]);
  });

  it('should return false when out of canvas', () => {
    const position = [-IN_CANVAS, -IN_CANVAS];
    expect(component['withinCanvas'](position)).toEqual(false);
  });

  it('should return true when in canvas', () => {
    const position = [IN_CANVAS, IN_CANVAS];
    component['canvas'].width = MAX_HEIGHT;
    component['canvas'].height = MAX_HEIGHT;
    expect(component['withinCanvas'](position)).toEqual(true);
  });

  it('should return false when is not new point', () => {
    component['viewedPoints'] = new Set();
    component['viewedPoints'].add('0,0');
    component['viewedPoints'].add('0,1');
    expect(component['isNewPoint'](2)).toEqual(false);
  });

  it('should return true when is new point', () => {
    component['viewedPoints'] = new Set();
    component['viewedPoints'].add('0,0');
    component['viewedPoints'].add('0,1');
    expect(component['isNewPoint'](1)).toEqual(true);
  });

  it('should return false when color is not within tolerance', () => {
    component['tolerance'] = TOLERANCE;
    component['initialColour'] = [0, 0, 0];
    const color = [MAX_HEIGHT, MAX_HEIGHT, MAX_HEIGHT];
    expect(component['acceptsColour'](color)).toEqual(false);
  });

  it('should return true when color is within tolerance', () => {
    component['tolerance'] = TOLERANCE;
    component['initialColour'] = [0, 0, 0];
    const color = [1, 1, 1];
    expect(component['acceptsColour'](color)).toEqual(true);
  });

  it('should order points and write in object', () => {
    component['addedPoints'] = [[0, 0], [MAX_HEIGHT, MAX_HEIGHT], [0, 1]];
    component['orderPoints']();
    expect(component['shape'].points).toEqual('0,0 0,1 255,255 0,0 ');
  });

  it('#drawImage should retrieve attributes properly', () => {
    const spy = spyOn(XMLSerializer.prototype, 'serializeToString').and.callFake(() => '');
    const img = new Image();
    img.addEventListener('load', () => { return; });

    component.initializeCanvas();
    expect(img.width).toEqual(component['canvas'].width);
    expect(img.height).toEqual(component['canvas'].height);
    expect(img.src).toBeDefined();
    expect(component['context']).not.toBeNull();
    expect(spy).toHaveBeenCalled();
  });

  it('#calculateDimensions should calculate dimensions', () => {
    component['addedPoints'] = [[0, 0], [MAX_HEIGHT, MAX_HEIGHT], [0, 1]];
    component['calculateDimensions']();
    expect(component['shape'].width).toEqual(MAX_HEIGHT);
    expect(component['shape'].height).toEqual(MAX_HEIGHT);
    expect(component['shape'].x).toEqual(0);
    expect(component['shape'].y).toEqual(0);
    expect(component['previewBox'].width).toEqual(MAX_HEIGHT);
    expect(component['previewBox'].height).toEqual(MAX_HEIGHT);
    expect(component['previewBox'].x).toEqual(0);
    expect(component['previewBox'].y).toEqual(0);
  });

});
