// tslint:disable:no-string-literal
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PlumeComponent } from './plume.component';
import { AttributesService } from '../../assets/attributes/attributes.service';
import { PenComponent } from '../pen/pen.component';
import { DrawingStorageService } from 'src/app/services/drawing-storage/drawing-storage.service';
import { SaveService } from 'src/app/services/save-service/save.service';
import { ToolConstants } from '../../assets/constants/tool-constants';

const ANGLE = 45;
const LINE_LENGHT = 5;

describe('PlumeComponent', () => {
  let plumeComponent: PlumeComponent;
  let attrService: AttributesService;
  let fixture: ComponentFixture<PlumeComponent>;
  const drawingServiceMock: DrawingStorageService = new DrawingStorageService();
  const attributesServiceMock: AttributesService = new AttributesService();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PlumeComponent],
      imports: [BrowserAnimationsModule],
      providers: [
        SaveService,
        { provide: DrawingStorageService, useValue: drawingServiceMock, },
        { provide: AttributesService, useValue: attributesServiceMock, },
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlumeComponent);
    attrService = TestBed.get(AttributesService);
    plumeComponent = fixture.componentInstance;
    drawingServiceMock.emptyDrawings();
  });

  afterEach(() => {
    fixture.destroy();
    attrService.resetSavedAttributes();
  });

  it('should create', () => {
    expect(plumeComponent).toBeTruthy();
  });

  it('should save the attribute when the component is destroyed', () => {
    const spy = spyOn(plumeComponent, 'saveAttribute');
    plumeComponent.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
  });

  it('should properly save the attributes', () => {
    plumeComponent.ngOnDestroy();
    expect(attrService.plumeAttributes.savedLineLenght).toEqual(ToolConstants.DEFAULT_LINELENGHT,
      'stroke.strokeWidth was not successfully saved upon destruction');
    expect(attrService.plumeAttributes.savedAngle).toEqual(ToolConstants.DEFAULT_ANGLE,
      'stroke.strokeWidth was not successfully saved upon destruction');
    expect(attrService.plumeAttributes.wasSaved).toBe(true, '#ngOnDestroy did not set wasSaved to true');
  });

  it('#ngOnInit should not load strokewidth and filter if there are no attributes saved in the service', () => {
    attrService.plumeAttributes.wasSaved = false;
    attrService.plumeAttributes.savedLineLenght = LINE_LENGHT;
    attrService.plumeAttributes.savedMinWidth = ANGLE;
    plumeComponent.ngOnInit();
    expect(plumeComponent['lineLenght']).toEqual(ToolConstants.DEFAULT_LINELENGHT,
      'no loading of attributes, yet minWidth did not take default value');
    expect(plumeComponent['angle']).toEqual(ToolConstants.DEFAULT_ANGLE,
      'no loading of attributes, yet maxWidth did not take default value');
  });

  it('#ngOnInit should load strokewidth and filter if there are attributes saved in the service', () => {
    attrService.plumeAttributes.wasSaved = true;
    attrService.plumeAttributes.savedLineLenght = LINE_LENGHT;
    attrService.plumeAttributes.savedMinWidth = ANGLE;
    plumeComponent.ngOnInit();
    expect(plumeComponent['lineLenght']).toEqual(LINE_LENGHT,
      'loading of attributes, yet minWidth did not take saved value');
    expect(plumeComponent['angle']).toEqual(ANGLE,
      'loading of attributes, yet maxWidth did not take saved value');
  });

});
