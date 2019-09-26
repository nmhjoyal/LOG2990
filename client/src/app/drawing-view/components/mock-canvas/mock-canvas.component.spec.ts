import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MockCanvasComponent } from './mock-canvas.component';

describe('MockCanvasComponent', () => {
  let component: MockCanvasComponent;
  let fixture: ComponentFixture<MockCanvasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MockCanvasComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MockCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
