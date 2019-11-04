    // tslint:disable: no-string-literal
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
import { AttributesService } from '../../assets/attributes/attributes.service';
import { ToolConstants } from '../../assets/tool-constants';
import { CrayonComponent } from './crayon.component';

const INITIAL_X = 150;
const INITIAL_Y = 200;
const STROKE_WIDTH = 5;

describe('CrayonComponent', () => {
  let component: CrayonComponent;
  let attrService: AttributesService;
  let fixture: ComponentFixture<CrayonComponent>;
  const toolServiceMock: jasmine.SpyObj<ToolHandlerService> = jasmine.createSpyObj('ToolHandlerService', ['']);
  const attributesServiceMock: AttributesService = new AttributesService();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CrayonComponent],
      imports: [BrowserAnimationsModule],
      providers: [
        { provide: ToolHandlerService, useValue: toolServiceMock, },
        { provide: AttributesService, useValue: attributesServiceMock, },
      ],
    })
      .compileComponents();
  }));
    // tslint:disable:no-string-literal

  beforeEach(() => {
    fixture = TestBed.createComponent(CrayonComponent);
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
    expect(attrService.crayonAttributes.savedStrokeWidth).toEqual(ToolConstants.DEFAULT_STROKE_WIDTH,
      'stroke.strokeWidth was not successfully saved upon destruction');
    expect(attrService.crayonAttributes.wasSaved).toBe(true, '#ngOnDestroy did not set wasSaved to true');
  });

  it('#ngOnInit should not load strokewidth if there are no attributes saved in the service', () => {
    attrService.crayonAttributes.wasSaved = false;
    attrService.crayonAttributes.savedStrokeWidth = STROKE_WIDTH;

    component.ngOnInit();

    expect(component['stroke'].strokeWidth).toEqual(ToolConstants.DEFAULT_STROKE_WIDTH,
      'no loading of attributes, yet strokeWidth did not take default value');
  });

  it('#ngOnInit should load strokewidth if there are attributes saved in the service', () => {
    attrService.crayonAttributes.wasSaved = true;
    attrService.crayonAttributes.savedStrokeWidth = STROKE_WIDTH;

    component.ngOnInit();

    expect(component['stroke'].strokeWidth).toEqual(STROKE_WIDTH,
      'loading of attributes, yet strokeWidth did not take saved value');
  });
});
