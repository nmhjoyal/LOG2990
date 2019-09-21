import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeSweetHomeComponent } from './home-sweet-home.component';

describe('HomeSweetHomeComponent', () => {
  let component: HomeSweetHomeComponent;
  let fixture: ComponentFixture<HomeSweetHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeSweetHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeSweetHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
