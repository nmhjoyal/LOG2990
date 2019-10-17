import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GalleryWindowComponent } from './gallery-window.component';

describe('GalleryWindowComponent', () => {
  let component: GalleryWindowComponent;
  let fixture: ComponentFixture<GalleryWindowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GalleryWindowComponent],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GalleryWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
