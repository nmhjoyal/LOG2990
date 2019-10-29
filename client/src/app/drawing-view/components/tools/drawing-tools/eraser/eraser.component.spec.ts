import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ColorService } from '../../../../../services/color_service/color.service';
import { SelectorService } from '../../../../../services/selector-service/selector-service';
import { ToolHandlerService } from '../../../../../services/tool-handler/tool-handler.service';
import { IShape } from 'src/app/drawing-view/components/tools/assets/interfaces/shape-interface';
import { EraserComponent } from './eraser.component';

describe('EraserComponent', () => {
  let component: EraserComponent;
  let fixture: ComponentFixture<EraserComponent>;
  let toolHandlerservice: ToolHandlerService;
  let colorservice: ColorService;

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
    const event = new MouseEvent('onmousedown');
    component.mouseDown(event);
    expect(component.leftClicked).toBeTruthy();
  });

  it('should set leftClicked to false when mouseup', () => {
    component.mouseUp();
    expect(component.leftClicked).toBeFalsy();
  });

  // it('should delete a drawing', () => {
  //   colorservice = new ColorService();
  //   toolHandlerservice = new ToolHandlerService(colorservice);
  //   const mydrawing: IShape = {
  //     id: 'myshape',
  //     x: 50,
  //     y: 50,
  //     width: 50,
  //     height: 50,
  //     verticesNumber: 4,
  //     vertices: '',
  //     primaryColor: 'someColor',
  //     secondaryColor: 'someColor',
  //     strokeOpacity: 1,
  //     strokeWidth: 1,
  //     fillOpacity: 1,
  //   };
  //   toolHandlerservice.drawings.push(mydrawing);

  // })
});
