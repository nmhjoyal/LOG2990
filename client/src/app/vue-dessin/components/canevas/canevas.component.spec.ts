import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CanevasComponent } from './canevas.component';

describe('CanevasComponent', () => {
  let component: CanevasComponent;
  let fixture: ComponentFixture<CanevasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CanevasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CanevasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
