// tslint:disable: no-string-literal
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SaveService } from 'src/app/services/save-service/save.service';
import { AttributesService } from '../../assets/attributes/attributes.service';
import { ToolConstants } from '../../assets/constants/tool-constants';
import { BucketComponent } from './bucket.component';

const INITIAL_X = 150;
const INITIAL_Y = 200;
const STROKE_WIDTH = 5;

describe('BucketComponent', () => {
  let component: BucketComponent;
  let attrService: AttributesService;
  let fixture: ComponentFixture<BucketComponent>;
  const saveServiceMock: jasmine.SpyObj<SaveService> = jasmine.createSpyObj('SaveService', ['saveDrawing']);
  const attributesServiceMock: AttributesService = new AttributesService();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BucketComponent],
      imports: [BrowserAnimationsModule],
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

  it('should save the attribute when the component is destroyed', () => {
    const spy = spyOn(component, 'saveAttribute');
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
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

  it('#ngOnInit should load strokewidth if there are attributes saved in the service', () => {
    attrService.bucketAttributes.wasSaved = true;
    attrService.bucketAttributes.savedStrokeWidth = STROKE_WIDTH;

    component.ngOnInit();

    expect(component['shape'].strokeWidth).toEqual(STROKE_WIDTH,
      'loading of attributes, yet strokeWidth did not take saved value');
  });
});
