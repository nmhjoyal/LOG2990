import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ColorService } from '../../../../../services/color_service/color.service';
import { SelectorService } from '../../../../../services/selector-service/selector-service';
import { ToolHandlerService } from '../../../../../services/tool-handler/tool-handler.service';
import { ITools } from '../../assets/interfaces/itools';
import { IShape } from '../../assets/interfaces/shape-interface';
import { EraserComponent } from './eraser.component';

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
  });

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

    expect(component.eraseObject().id).toBe('rectangleErased');
  });

  it('should not delete object if coordinates do not match', () => {
    colorserviceMock = new ColorService();
    toolhandlerMock = new ToolHandlerService(colorserviceMock);
    const rectangleMock: IShape = {
      id: 'rectangle',
      x: 50,
      y: 50,
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
    component.eraseObject();
    expect((toolhandlerMock.drawings[0] as ITools).id).toBe('rectangle');
  });

  it('should not delete object if leftClicked is false', () => {
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
    const mouseeventMock = new MouseEvent('mousemove');
    component.leftClicked = false;
    component.mouseMove(mouseeventMock);
    expect((toolhandlerMock.drawings[0] as ITools).id).toBe('rectangle');
  });

  it('should outline red on matching coordinates', () => {
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
  });

  it('should not outline red if coordinates do not match', () => {
    colorserviceMock = new ColorService();
    toolhandlerMock = new ToolHandlerService(colorserviceMock);
    const rectangleMock: IShape = {
      id: 'rectangle',
      x: 20,
      y: 20,
      width: 20,
      height: 20,
      verticesNumber: 4,
      vertices: '',
      primaryColor: '',
      secondaryColor: 'secondary',
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
    expect(rectangleMock.secondaryColor).toBe('secondary');
  });

  it('should initialize correct eraser properties', () => {
    const mouseeventMock = new MouseEvent('mousemove');
    component.setEraserProperties(mouseeventMock);
    expect(component.eraser.width).toBe(10);
    expect(component.eraser.height).toBe(10);
    expect(component.eraser.x).toBe(mouseeventMock.offsetX);
    expect(component.eraser.y).toBe(mouseeventMock.offsetX);
  });
});
