import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveWindowComponent } from './save-window.component';

describe('SaveWindowComponent', () => {
  let component: SaveWindowComponent;
  let fixture: ComponentFixture<SaveWindowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SaveWindowComponent],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
