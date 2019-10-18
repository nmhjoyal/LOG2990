    // tslint:disable: no-string-literal
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
import { ToolConstants } from '../../assets/tool-constants';
import { PaintbrushComponent } from './paintbrush.component';
import { AttributesService } from '../../assets/attributes/attributes.service';

const INITIAL_X = 150;
const INITIAL_Y = 200;


describe('PaintbrushComponent', () => {
  let component: PaintbrushComponent;
  let attrService: AttributesService;
  let fixture: ComponentFixture<PaintbrushComponent>;
  const toolServiceMock: jasmine.SpyObj<ToolHandlerService> = jasmine.createSpyObj('ToolHandlerService', ['']);
  const attributesServiceMock: AttributesService = new AttributesService();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PaintbrushComponent],
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
    component.setFilter(0);
    component.saveAttribute();
    expect(attrService.paintbrushAttributes.savedFilter).toEqual(ToolConstants.FILTER_ID.FILTER0);
  });

  it('should set the appropriate filter for the first case', () => {
    component.setFilter(1);
    component.saveAttribute();
    expect(attrService.paintbrushAttributes.savedFilter).toEqual(ToolConstants.FILTER_ID.FILTER1);
  });

  it('should set the appropriate filter for the second case', () => {
    component.setFilter(2);
    component.saveAttribute();
    expect(attrService.paintbrushAttributes.savedFilter).toEqual(ToolConstants.FILTER_ID.FILTER2);
  });

  it('should set the appropriate filter for the third case', () => {
    component.setFilter(3);
    component.saveAttribute();
    expect(attrService.paintbrushAttributes.savedFilter).toEqual(ToolConstants.FILTER_ID.FILTER3);
  });

  it('should set the appropriate filter for the fourth case', () => {
    component.setFilter(4);
    component.saveAttribute();
    expect(attrService.paintbrushAttributes.savedFilter).toEqual(ToolConstants.FILTER_ID.FILTER4);
  });
  it('should set the appropriate filter for the fifth case', () => {
    component.setFilter(5);
    component.saveAttribute();
    expect(attrService.paintbrushAttributes.savedFilter).toEqual(ToolConstants.FILTER_ID.FILTER5);
  });
  it('should default to no filter', () => {
    component.setFilter(10);
    component.saveAttribute();
    expect(attrService.paintbrushAttributes.savedFilter).toEqual(ToolConstants.FILTER_ID.FILTER0);
  });

});
