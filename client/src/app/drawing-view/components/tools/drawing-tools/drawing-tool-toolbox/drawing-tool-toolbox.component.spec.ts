import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
import { DrawingToolToolboxComponent } from './drawing-tool-toolbox.component';
import { ToolAbstract } from '../../assets/abstracts/tool-abstract/tool-abstract';


class MockTool extends ToolAbstract {
  constructor() {
    super();
  }

  ngOnDestroy(): void {
    //empty body
  }

  ngOnInit(): void {
    //empty body
  }
}

describe('DrawingToolToolboxComponent', () => {
  let component: DrawingToolToolboxComponent;
  let fixture: ComponentFixture<DrawingToolToolboxComponent>;
  const MockToolHandler: jasmine.SpyObj<ToolHandlerService> = jasmine.createSpyObj('ToolHandlerService', ['']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrawingToolToolboxComponent ],
      providers: [
        {provide: ToolHandlerService,
          useValue: MockToolHandler},
      ],
    }).compileComponents().then(() =>{
      fixture = TestBed.createComponent(DrawingToolToolboxComponent);
      component = fixture.componentInstance;

      // tslint:disable-next-line:no-any
      spyOn<any>(component.canvas, "activeTool").and.callFake(() => {
        return new MockTool();
      });
      
      fixture.detectChanges();
      });
  }));

});
