import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FenetreBienvenueComponent } from './fenetre-bienvenue.component';

describe('FenetreBienvenueComponent', () => {
  let component: FenetreBienvenueComponent;
  let fixture: ComponentFixture<FenetreBienvenueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FenetreBienvenueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FenetreBienvenueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
