import { HttpClientModule } from '@angular/common/http';
import { Type } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ModalWindowComponent } from './modal-window.component';

describe('ModalWindowComponent', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        MatDialogModule,
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

  it('should have defined dialogRef to confirm it is a valid dialog', () => {
    const fixture = TestBed.createComponent(ModalWindowComponent as Type<ModalWindowComponent>);
    const app = fixture.componentInstance;
    expect(app.dialogRef).toBeDefined();
  });

});
