    // tslint:disable: no-string-literal
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AttributesService } from '../../assets/attributes/attributes.service';
import { ToolConstants } from '../../assets/constants/tool-constants';
import { PaintbrushComponent } from './paintbrush.component';
import { SaveService } from 'src/app/services/save-service/save.service';

const INITIAL_X = 150;
const INITIAL_Y = 200;
const OUTSIDE_FILTER_RANGE = 10;

describe('PaintbrushComponent', () => {
  let component: PaintbrushComponent;
  let attrService: AttributesService;
  let fixture: ComponentFixture<PaintbrushComponent>;
  const saveServiceMock: jasmine.SpyObj<SaveService> = jasmine.createSpyObj('SaveService', ['saveDrawing']);
  const attributesServiceMock: AttributesService = new AttributesService();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PaintbrushComponent],
      imports: [BrowserAnimationsModule],
      providers: [
        { provide: SaveService, useValue: saveServiceMock, },
        { provide: AttributesService, useValue: attributesServiceMock, },
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaintbrushComponent);
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
    expect(attrService.paintbrushAttributes.savedStrokeWidth).toEqual(ToolConstants.DEFAULT_STROKE_WIDTH,
      'stroke.strokeWidth was not successfully saved upon destruction');
    expect(attrService.paintbrushAttributes.savedFilter).toEqual(ToolConstants.FILTER_ID.FILTER0,
      'the filter was not successfully saved upon destruction');
    expect(attrService.paintbrushAttributes.wasSaved).toBe(true, '#ngOnDestroy did not set wasSaved to true');

  });

  it('should set no filter for case 0', () => {
    component.setFilter(ToolConstants.FILTER_SELECTION.FILTER0);
    component.saveAttribute();
    expect(attrService.paintbrushAttributes.savedFilter).toEqual(ToolConstants.FILTER_ID.FILTER0);
  });

  it('should set the appropriate filter for the first case', () => {
    component.setFilter(ToolConstants.FILTER_SELECTION.FILTER1);
    component.saveAttribute();
    expect(attrService.paintbrushAttributes.savedFilter).toEqual(ToolConstants.FILTER_ID.FILTER1);
  });

  it('should set the appropriate filter for the second case', () => {
    component.setFilter(ToolConstants.FILTER_SELECTION.FILTER2);
    component.saveAttribute();
    expect(attrService.paintbrushAttributes.savedFilter).toEqual(ToolConstants.FILTER_ID.FILTER2);
  });

  it('should set the appropriate filter for the third case', () => {
    component.setFilter(ToolConstants.FILTER_SELECTION.FILTER3);
    component.saveAttribute();
    expect(attrService.paintbrushAttributes.savedFilter).toEqual(ToolConstants.FILTER_ID.FILTER3);
  });

  it('should set the appropriate filter for the fourth case', () => {
    component.setFilter(ToolConstants.FILTER_SELECTION.FILTER4);
    component.saveAttribute();
    expect(attrService.paintbrushAttributes.savedFilter).toEqual(ToolConstants.FILTER_ID.FILTER4);
  });
  it('should set the appropriate filter for the fifth case', () => {
    component.setFilter(ToolConstants.FILTER_SELECTION.FILTER5);
    component.saveAttribute();
    expect(attrService.paintbrushAttributes.savedFilter).toEqual(ToolConstants.FILTER_ID.FILTER5);
  });
  it('should default to no filter', () => {
    component.setFilter(OUTSIDE_FILTER_RANGE);
    component.saveAttribute();
    expect(attrService.paintbrushAttributes.savedFilter).toEqual(ToolConstants.FILTER_ID.FILTER0);
  });

});

    // tslint:disable:no-string-literal
