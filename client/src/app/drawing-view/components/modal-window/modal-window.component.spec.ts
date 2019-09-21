import { HttpClientModule } from '@angular/common/http';
import { Type } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ModalWindowComponent } from './modal-window.component';

describe('ModalWindowComponent', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        HttpClientModule,
        MatDialogModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        BrowserAnimationsModule,
      ],
      declarations: [
        ModalWindowComponent,
      ],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: [] },
      ],
    }).compileComponents();
  }));

  it('should create', () => {
    const fixture = TestBed.createComponent(ModalWindowComponent as Type<ModalWindowComponent>);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('shoud have defined dialogRef', () => {
    const fixture = TestBed.createComponent(ModalWindowComponent as Type<ModalWindowComponent>);
    const app = fixture.componentInstance;
    expect(app.dialogRef).toBeDefined();
  });
});
