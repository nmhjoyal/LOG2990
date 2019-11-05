import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
import { AttributesService } from '../../assets/attributes/attributes.service';
import { ToolConstants } from '../../assets/tool-constants';
import { StyloComponent } from './stylo.component';

const INITIAL_X = 150;
const INITIAL_Y = 200;
const MIN_STROKE_WIDTH = 3;
const MAX_STROKE_WIDTH = 9;

describe('StyloComponent', () => {
  let component: StyloComponent;
  let attrService: AttributesService;
  let fixture: ComponentFixture<StyloComponent>;
  const toolServiceMock: jasmine.SpyObj<ToolHandlerService> = jasmine.createSpyObj('ToolHandlerService', ['']);
  const attributesServiceMock: AttributesService = new AttributesService();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StyloComponent],
      imports: [BrowserAnimationsModule],
      providers: [
        { provide: ToolHandlerService, useValue: toolServiceMock, },
        { provide: AttributesService, useValue: attributesServiceMock, },
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StyloComponent);
    attrService = TestBed.get(AttributesService);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component['x'] = INITIAL_X;
    component['y'] = INITIAL_Y;
    component['mouseDown'] = true;
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
    expect(attrService.styloAttributes.savedMinWidth).toEqual(ToolConstants.DEFAULT_MIN_WIDTH,
      'stroke.strokeWidth was not successfully saved upon destruction');
    expect(attrService.styloAttributes.savedMaxWidth).toEqual(ToolConstants.DEFAULT_MAX_WIDTH,
      'stroke.strokeWidth was not successfully saved upon destruction');
    expect(attrService.styloAttributes.wasSaved).toBe(true, '#ngOnDestroy did not set wasSaved to true');

  });

  it('#ngOnInit should not load strokewidth and filter if there are no attributes saved in the service', () => {
    attrService.styloAttributes.wasSaved = false;
    attrService.styloAttributes.savedMaxWidth = MAX_STROKE_WIDTH;
    attrService.styloAttributes.savedMinWidth = MIN_STROKE_WIDTH;

    component.ngOnInit();

    expect(component['stylo'].minWidth).toEqual(ToolConstants.DEFAULT_MIN_WIDTH,
      'no loading of attributes, yet minWidth did not take default value');
    expect(component['stylo'].maxWidth).toEqual(ToolConstants.DEFAULT_MAX_WIDTH,
      'no loading of attributes, yet maxWidth did not take default value');
  });

  it('#ngOnInit should load strokewidth and filter if there are attributes saved in the service', () => {
    attrService.styloAttributes.wasSaved = true;
    attrService.styloAttributes.savedMaxWidth = MAX_STROKE_WIDTH;
    attrService.styloAttributes.savedMinWidth = MIN_STROKE_WIDTH;

    component.ngOnInit();

    expect(component['stylo'].minWidth).toEqual(MIN_STROKE_WIDTH,
      'loading of attributes, yet minWidth did not take saved value');
      expect(component['stylo'].maxWidth).toEqual(MAX_STROKE_WIDTH,
      'loading of attributes, yet maxWidth did not take saved value');
  });

});