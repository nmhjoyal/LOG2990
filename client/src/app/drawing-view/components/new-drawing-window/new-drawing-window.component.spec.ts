import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewDrawingWindowComponent } from './new-drawing-window.component';

describe('NewDrawingWindowComponent', () => {
  let component: NewDrawingWindowComponent;
  let fixture: ComponentFixture<NewDrawingWindowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewDrawingWindowComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewDrawingWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
