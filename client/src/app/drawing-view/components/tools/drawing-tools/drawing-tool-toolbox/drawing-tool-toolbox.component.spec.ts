import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
import { CanvasComponent } from '../../../canvas/canvas.component';
import { DrawingToolToolboxComponent } from './drawing-tool-toolbox.component';

describe('DrawingToolToolboxComponent', () => {
  let component: DrawingToolToolboxComponent;
  const mockCanvasComponent: jasmine.SpyObj<CanvasComponent> = jasmine.createSpyObj('CanvasComponent', ['activeTool']);
  let fixture: ComponentFixture<DrawingToolToolboxComponent>;
  const MockToolHandler: jasmine.SpyObj<ToolHandlerService> = jasmine.createSpyObj('ToolHandlerService', ['']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrawingToolToolboxComponent ],
      providers: [
        {provide: ToolHandlerService,
          useValue: MockToolHandler},
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawingToolToolboxComponent);
    component = fixture.componentInstance;
    component.canvas = mockCanvasComponent;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#getComponent should return the appropriate component', () => {
    const returned = component.getComponent();
    expect(returned).toEqual(component.canvas.activeTool);
  });

});
