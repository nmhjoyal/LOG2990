import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlumeComponent } from './plume.component';

describe('PlumeComponent', () => {
  let component: PlumeComponent;
  let fixture: ComponentFixture<PlumeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlumeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlumeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
