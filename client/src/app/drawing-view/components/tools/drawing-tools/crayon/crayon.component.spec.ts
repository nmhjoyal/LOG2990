    // tslint:disable: no-string-literal
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AttributesService } from '../../assets/attributes/attributes.service';
import { ToolConstants } from '../../assets/constants/tool-constants';
import { CrayonComponent } from './crayon.component';
import { SaveService } from 'src/app/services/save-service/save.service';

const INITIAL_X = 150;
const INITIAL_Y = 200;

describe('CrayonComponent', () => {
  let component: CrayonComponent;
  let attrService: AttributesService;
  let fixture: ComponentFixture<CrayonComponent>;
  const saveServiceMock: jasmine.SpyObj<SaveService> = jasmine.createSpyObj('SaveService', ['saveDrawing']);
  const attributesServiceMock: AttributesService = new AttributesService();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CrayonComponent],
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
});
