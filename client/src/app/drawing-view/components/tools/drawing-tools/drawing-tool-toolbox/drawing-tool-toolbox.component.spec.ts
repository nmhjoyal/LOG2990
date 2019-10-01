import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawingToolToolboxComponent } from './drawing-tool-toolbox.component';

describe('DrawingToolToolboxComponent', () => {
  let component: DrawingToolToolboxComponent;
  let fixture: ComponentFixture<DrawingToolToolboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrawingToolToolboxComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawingToolToolboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
