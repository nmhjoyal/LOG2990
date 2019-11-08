import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ColorService } from '../../../../../services/color_service/color.service';
import { ToolHandlerService } from '../../../../../services/tool-handler/tool-handler.service';
import { ITools } from '../../assets/interfaces/itools';
import { IShape } from '../../assets/interfaces/shape-interface';
import { EraserComponent } from './eraser.component';

describe('EraserComponent', () => {
  let component: EraserComponent;
  let fixture: ComponentFixture<EraserComponent>;
  let toolhandlerMock: ToolHandlerService;
  let colorserviceMock: ColorService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EraserComponent ],
      providers: []
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
    component.colorService = colorserviceMock;
    component.eraser.x = 0;
    component.eraser.y = 0;
    component.eraseObject();
    expect((toolhandlerMock.drawings[0] as ITools).id).toBe('rectangle');
  });

  it('should not call eraseObject if leftClicked is false', () => {
    component.leftClicked = false;
    const mouseeventMock = new MouseEvent('mousemove');
    spyOn(component, 'eraseObject');
    component.mouseMove(mouseeventMock);
    expect(component.eraseObject).not.toHaveBeenCalled();
  });

  it('should call eraseObject if leftClicked is true', () => {
    component.leftClicked = true;
    const mouseeventMock = new MouseEvent('mousemove');
    spyOn(component, 'eraseObject');
    component.mouseMove(mouseeventMock);
    expect(component.eraseObject).toHaveBeenCalled();
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
    component.colorService = colorserviceMock;
    component.eraser.x = 0;
    component.eraser.y = 0;
    component.redOutline();
    expect(rectangleMock.secondaryColor).toBe('secondary');
  });

  it('should set object outline colour back to default when hovered off', () => {
    colorserviceMock = new ColorService();
    colorserviceMock.color[1] = 'black';
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
      secondaryColor: 'red',      // on hover, outline is set to red
      strokeOpacity: 1,
      strokeWidth: 1,
      fillOpacity: 1,
    };

    toolhandlerMock.drawings.push(rectangleMock);

    // matching eraser services to mock services
    component.toolService = toolhandlerMock;
    component.colorService = colorserviceMock;
    component.eraser.x = 0;
    component.eraser.y = 0;
    component.redOutline();
    expect(rectangleMock.secondaryColor).toBe('black');
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
