import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShapePerimeterComponent } from './shape-perimeter.component';

describe('ShapePerimeterComponent', () => {
  let component: ShapePerimeterComponent;
  let fixture: ComponentFixture<ShapePerimeterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShapePerimeterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShapePerimeterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
