import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DrawingViewModule } from 'src/app/drawing-view/drawing-view.module';
import { PaintbrushComponent } from './paintbrush.component';

describe('PaintbrushComponent', () => {
  let component: PaintbrushComponent;
  let fixture: ComponentFixture<PaintbrushComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
      ],
      imports: [
        HttpClientModule,
        BrowserAnimationsModule,
        DrawingViewModule,
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaintbrushComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
