import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectorService } from '../../../../../services/selector-service/selector-service';
import { EraserComponent } from './eraser.component';
import { ToolHandlerService } from '../../../../../services/tool-handler/tool-handler.service';
import { ColorService } from '../../../../../services/color_service/color.service';
import { IShape } from '../../assets/interfaces/shape-interface';

describe('EraserComponent', () => {
  let component: EraserComponent;
  let fixture: ComponentFixture<EraserComponent>;
  let toolhandlerMock: ToolHandlerService;
  let colorserviceMock: ColorService;
  let selectorserviceMock: SelectorService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EraserComponent ],
      providers: [SelectorService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EraserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set leftClicked to true when mouse is clicked', () => {
    component.mouseDown();
    expect(component.leftClicked).toBeTruthy();
  });

  it('should set leftClicked to false when mouseup', () => {
    component.mouseUp();
    expect(component.leftClicked).toBeFalsy();
  });

  it('should have initial (0,460) x/y coordinates', () => {
    expect(component.eraser.x).toBe(0);
    expect(component.eraser.y).toBe(460);
  })

  it('should delete object by changing its id', () => {
    colorserviceMock = new ColorService();
    toolhandlerMock = new ToolHandlerService(colorserviceMock);
    const rectangleMock: IShape = {
      id: 'rectangle',
      x: 0,
      y: 0,
      width: 20,
      height: 20,
      verticesNumber: 4,
      vertices: '',
      primaryColor: '',
      secondaryColor: '',
      strokeOpacity: 1,
      strokeWidth: 1,
      fillOpacity: 1,
    };
  
    toolhandlerMock.drawings.push(rectangleMock);

    // matching eraser services to mock services
    component.toolService = toolhandlerMock;
    component.selectorService = selectorserviceMock;
    component.colorService = colorserviceMock;
    component.eraser.x = 0;
    component.eraser.y = 0;

    const erasedId = component.eraseObject().id;
    expect(erasedId).toBe('rectangleErased');
  })

  it('should outline red', () => {
    colorserviceMock = new ColorService();
    toolhandlerMock = new ToolHandlerService(colorserviceMock);
    const rectangleMock: IShape = {
      id: 'rectangle',
      x: 0,
      y: 0,
      width: 20,
      height: 20,
      verticesNumber: 4,
      vertices: '',
      primaryColor: '',
      secondaryColor: '',
      strokeOpacity: 1,
      strokeWidth: 1,
      fillOpacity: 1,
    };
  
    toolhandlerMock.drawings.push(rectangleMock);

    // matching eraser services to mock services
    component.toolService = toolhandlerMock;
    component.selectorService = selectorserviceMock;
    component.colorService = colorserviceMock;
    component.eraser.x = 0;
    component.eraser.y = 0;
    component.redOutline();
    expect(rectangleMock.secondaryColor).toBe('red');
  })
  
});
