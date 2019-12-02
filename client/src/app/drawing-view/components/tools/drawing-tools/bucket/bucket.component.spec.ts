// tslint:disable: no-string-literal
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { SaveService } from 'src/app/services/save-service/save.service';
import { AttributesService } from '../../assets/attributes/attributes.service';
import { ToolConstants } from '../../assets/constants/tool-constants';
import { BucketComponent } from './bucket.component';

const INITIAL_X = 150;
const INITIAL_Y = 200;
const STROKE_WIDTH = 5;
const TOLERANCE = 25;

describe('BucketComponent', () => {
  let component: BucketComponent;
  let attrService: AttributesService;
  let fixture: ComponentFixture<BucketComponent>;
  const saveServiceMock: jasmine.SpyObj<SaveService> = jasmine.createSpyObj('SaveService', ['saveDrawing']);
  const attributesServiceMock: AttributesService = new AttributesService();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BucketComponent],
      imports: [BrowserDynamicTestingModule],
      providers: [
        { provide: SaveService, useValue: saveServiceMock, },
        { provide: AttributesService, useValue: attributesServiceMock, },
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

    component['shape'].x = INITIAL_X;
    component['shape'].y = INITIAL_Y;
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
      'the seleced number of vertices was not succesfully saved upon destruction');
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

  it('#ngOnDestroy should save the current attributes in the bucketAttributes interface of the service', () => {
    component.ngOnDestroy();
    expect(attrService.bucketAttributes.savedStrokeWidth).toEqual(ToolConstants.DEFAULT_STROKE_WIDTH,
      'shape.strokeWidth was not successfully saved upon destruction');
    expect(attrService.bucketAttributes.savedTraceMode).toEqual(ToolConstants.TRACE_MODE.CONTOUR_FILL,
      'the traceMode was not successfully saved upon destruction');
    expect(attrService.bucketAttributes.wasSaved).toBe(true, '#ngOnDestroy did not set wasSaved to true');
    expect(attrService.bucketAttributes.savedVerticesNumber).toEqual(ToolConstants.DEFAULT_TOLERANCE,
      'the tolerance was not succesfully saved upon destruction');

  });
  it('#ngOnInit should load strokewidth if there are attributes saved in the service', () => {
    attrService.bucketAttributes.wasSaved = true;
    attrService.bucketAttributes.savedStrokeWidth = STROKE_WIDTH;

    component.ngOnInit();

    expect(component['shape'].strokeWidth).toEqual(STROKE_WIDTH,
      'loading of attributes, yet strokeWidth did not take saved value');
  });

  it('should initialize canvas on #ngafterviewInit', () => {
    component.ngAfterViewInit();
    expect(component.initializeCanvas).toHaveBeenCalled();
  });

  it('should return false when out of canvas', () => {
    const position = [-20, -20];
    expect(component['withinCanvas'](position)).toEqual(false);
  });

  it('should return true when in canvas', () => {
    const position = [20, 20];
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
    expect(component['shape'].points).toEqual('0,0 0,1 255,255 ');
  });

});
