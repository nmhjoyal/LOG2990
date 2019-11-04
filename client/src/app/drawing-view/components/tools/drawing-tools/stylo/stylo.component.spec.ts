import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StyloComponent } from './stylo.component';

describe('StyloComponent', () => {
  let component: StyloComponent;
  let fixture: ComponentFixture<StyloComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StyloComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StyloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
