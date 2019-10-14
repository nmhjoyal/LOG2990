import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShapeToolboxComponent } from './shape-toolbox.component';
import { CanvasComponent } from '../../../canvas/canvas.component';

describe('ShapeToolboxComponent', () => {
  let component: ShapeToolboxComponent;
  const mockCanvasComponent: jasmine.SpyObj<CanvasComponent> = jasmine.createSpyObj('CanvasComponent', ['activeTool']);
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
    component.canvas = mockCanvasComponent;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#getComponent should return the appropriate component', () => {
    const returned = component.getComponent();
    expect(returned).toEqual(component.canvas.activeTool);
  });
});
