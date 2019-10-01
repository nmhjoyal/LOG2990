import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PinceauComponent } from './pinceau.component';

describe('PinceauComponent', () => {
  let component: PinceauComponent;
  let fixture: ComponentFixture<PinceauComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PinceauComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PinceauComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
