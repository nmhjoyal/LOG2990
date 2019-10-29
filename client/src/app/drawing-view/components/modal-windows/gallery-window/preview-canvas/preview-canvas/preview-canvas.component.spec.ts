import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PreviewCanvasComponent } from './preview-canvas.component';

describe('PreviewCanvasComponent', () => {
  let component: PreviewCanvasComponent;
  let fixture: ComponentFixture<PreviewCanvasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviewCanvasComponent ],
      imports: [
        BrowserDynamicTestingModule,
        BrowserAnimationsModule,
        HttpClientModule,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewCanvasComponent);
    component = fixture.componentInstance;
    component.previewedDrawing = {
      name: '',
      preview: {
        image: new SVGElement(),
      },
      shapes: [],
      timestamp: '',
      canvas: {
        drawingColor: '',
        drawingWidth: 0,
        drawingHeight: 0,
      },
    };
    fixture.detectChanges();
  });
});
