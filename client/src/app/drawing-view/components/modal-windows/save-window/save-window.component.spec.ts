import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatButtonModule, MatDialogModule, MatDialogRef, MatFormFieldModule, MatInputModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SaveWindowComponent } from './save-window.component';

describe('SaveWindowComponent', () => {
  let component: SaveWindowComponent;
  let fixture: ComponentFixture<SaveWindowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SaveWindowComponent],
      imports: [
        HttpClientModule,
        MatDialogModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        BrowserAnimationsModule,
        MatButtonModule,
      ],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: [] },
      ],
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
