import { OnDestroy, OnInit } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
import { ToolAbstract } from '../../assets/abstracts/tool-abstract/tool-abstract';
import { DrawingToolToolboxComponent } from './drawing-tool-toolbox.component';

class MockTool extends ToolAbstract implements OnInit, OnDestroy {
  constructor() {
    super();
  }

  ngOnDestroy(): void {
    // empty body
  }

  ngOnInit(): void {
    // empty body
  }
}

describe('DrawingToolToolboxComponent', () => {
  let component: DrawingToolToolboxComponent;
  let fixture: ComponentFixture<DrawingToolToolboxComponent>;
  const mockToolHandler: jasmine.SpyObj<ToolHandlerService> = jasmine.createSpyObj('ToolHandlerService', ['']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrawingToolToolboxComponent ],
      providers: [
        {provide: ToolHandlerService,
          useValue: mockToolHandler},
      ],
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(DrawingToolToolboxComponent);
      component = fixture.componentInstance;

      // tslint:disable-next-line:no-any no-string-literal
      spyOn<any>(component['canvas'], 'activeTool').and.callFake(() => {
        return new MockTool();
      });

      fixture.detectChanges();
      });
  }));

});
