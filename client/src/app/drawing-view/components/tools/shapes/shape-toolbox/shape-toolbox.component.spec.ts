import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShapeToolboxComponent } from './shape-toolbox.component';

describe('ShapeToolboxComponent', () => {
  let component: ShapeToolboxComponent;
  let fixture: ComponentFixture<ShapeToolboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShapeToolboxComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShapeToolboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return the appropriate component', () => {
    const spy = spyOn(component, 'getComponent');
    expect(spy).toEqual(component.shapeComponent);
  });
});
