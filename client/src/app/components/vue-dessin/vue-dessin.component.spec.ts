import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VueDessinComponent } from './vue-dessin.component';

describe('VueDessinComponent', () => {
  let component: VueDessinComponent;
  let fixture: ComponentFixture<VueDessinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VueDessinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VueDessinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
