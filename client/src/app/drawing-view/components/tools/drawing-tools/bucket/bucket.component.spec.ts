// tslint:disable: no-string-literal
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CanvasInformationService } from 'src/app/services/canvas-information/canvas-information.service';
import { ExportInformationService } from 'src/app/services/export-information/export-information.service';
import { SaveService } from 'src/app/services/save-service/save.service';
import { AttributesService } from '../../assets/attributes/attributes.service';
import { ToolConstants } from '../../assets/constants/tool-constants';
import { BucketComponent } from './bucket.component';

const INITIAL_X = 150;
const INITIAL_Y = 200;
const STROKE_WIDTH = 2;
const TOLERANCE = 25;

describe('BucketComponent', () => {
  let component: BucketComponent;
  let attrService: AttributesService;
  let fixture: ComponentFixture<BucketComponent>;
  const saveServiceMock: jasmine.SpyObj<SaveService> = jasmine.createSpyObj('SaveService', ['saveDrawing']);
  const attributesServiceMock: AttributesService = new AttributesService();
  const canvasDataMock: jasmine.SpyObj<CanvasInformationService> = jasmine.createSpyObj('CanvasInformationService', ['']);
  const exportDataMock: jasmine.SpyObj<ExportInformationService> = jasmine.createSpyObj('ExportInformationService', ['']);
  let hostElement: DebugElement;

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
    component['shape'].x = INITIAL_X;
    component['shape'].y = INITIAL_Y;
    hostElement = fixture.debugElement;
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

  it('should return false when out of canvas', () => {
    const position = [-20, -20];
    expect(component['withinCanvas'](position)).toEqual(false);
  });

  it('should return true when in canvas', () => {
    const position = [20, 20];
    component['canvas'].width = 100;
    component['canvas'].height = 100;
    expect(component['withinCanvas'](position)).toEqual(true);
  });

  it('should return false when is not new point', () => {
    component['viewedPoints'] = [[0, 0], [1, 1]];
    const position = [0, 0];
    expect(component['isNewPoint'](position)).toEqual(false);
  });

  it('should return true when is new point', () => {
    component['viewedPoints'] = [[0, 0], [1, 1]];
    const position = [0, 1];
    expect(component['isNewPoint'](position)).toEqual(true);
  });

  it('should return false when color is not within tolerance', () => {
    component['tolerance'] = 25;
    component['initialColour'] = [25, 25, 25];
    const color = [255, 255, 255];
    expect(component['acceptsColour'](color)).toEqual(false);
  });

  it('should return true when color is within tolerance', () => {
    component['tolerance'] = 25;
    component['initialColour'] = [25, 25, 25];
    const color = [25, 25, 25];
    expect(component['acceptsColour'](color)).toEqual(true);
  });

  it('should order points and write in object', () => {
    component['addedPoints'] = [[0, 0], [255, 255], [0, 1]];
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

});
