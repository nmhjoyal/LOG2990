import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SprayCanComponent } from './spray-can.component';

describe('SprayCanComponent', () => {
  let component: SprayCanComponent;
  let fixture: ComponentFixture<SprayCanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SprayCanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SprayCanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
