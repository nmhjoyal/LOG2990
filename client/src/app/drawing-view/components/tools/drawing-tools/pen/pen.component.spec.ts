import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
import { AttributesService } from '../../assets/attributes/attributes.service';
import { ToolConstants } from '../../assets/tool-constants';
import { PenComponent } from './pen.component';

const MIN_STROKE_WIDTH = 3;
const MAX_STROKE_WIDTH = 9;

describe('StyloComponent', () => {
  let component: PenComponent;
  let attrService: AttributesService;
  let fixture: ComponentFixture<PenComponent>;
  const toolServiceMock: jasmine.SpyObj<ToolHandlerService> = jasmine.createSpyObj('ToolHandlerService', ['']);
  const attributesServiceMock: AttributesService = new AttributesService();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PenComponent],
      imports: [BrowserAnimationsModule],
      providers: [
        { provide: ToolHandlerService, useValue: toolServiceMock, },
        { provide: AttributesService, useValue: attributesServiceMock, },
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PenComponent);
    attrService = TestBed.get(AttributesService);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    fixture.destroy();
    attrService.resetSavedAttributes();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should save the attribute when the component is destroyed', () => {
    const spy = spyOn(component, 'saveAttribute');
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
  });

  it('should properly save the attributes', () => {
    component.ngOnDestroy();
    expect(attrService.penAttributes.savedMinWidth).toEqual(ToolConstants.DEFAULT_MIN_WIDTH,
      'stroke.strokeWidth was not successfully saved upon destruction');
    expect(attrService.penAttributes.savedMaxWidth).toEqual(ToolConstants.DEFAULT_MAX_WIDTH,
      'stroke.strokeWidth was not successfully saved upon destruction');
    expect(attrService.penAttributes.wasSaved).toBe(true, '#ngOnDestroy did not set wasSaved to true');
  });

  it('#ngOnInit should not load strokewidth and filter if there are no attributes saved in the service', () => {
    attrService.penAttributes.wasSaved = false;
    attrService.penAttributes.savedMaxWidth = MAX_STROKE_WIDTH;
    attrService.penAttributes.savedMinWidth = MIN_STROKE_WIDTH;
    component.ngOnInit();
    expect(component.minWidth).toEqual(ToolConstants.DEFAULT_MIN_WIDTH,
      'no loading of attributes, yet minWidth did not take default value');
    expect(component.maxWidth).toEqual(ToolConstants.DEFAULT_MAX_WIDTH,
      'no loading of attributes, yet maxWidth did not take default value');
  });

  it('#ngOnInit should load strokewidth and filter if there are attributes saved in the service', () => {
    attrService.penAttributes.wasSaved = true;
    attrService.penAttributes.savedMaxWidth = MAX_STROKE_WIDTH;
    attrService.penAttributes.savedMinWidth = MIN_STROKE_WIDTH;
    component.ngOnInit();
    expect(component.minWidth).toEqual(MIN_STROKE_WIDTH,
      'loading of attributes, yet minWidth did not take saved value');
    expect(component.maxWidth).toEqual(MAX_STROKE_WIDTH,
      'loading of attributes, yet maxWidth did not take saved value');
  });

  it('should properly calculate speed between two points', () => {
    component.lastX = 1;
    component.lastY = 1;
    const pointB = [2, 2];
    component.lastTime = 1;
    const timeB = 2;
    // tslint:disable-next-line: no-any
    const result = (component as any).calculateSpeed(pointB[0], pointB[1], timeB);
    expect(result).toEqual(Math.sqrt(2));
  });

});
