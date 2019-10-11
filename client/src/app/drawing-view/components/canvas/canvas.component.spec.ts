import SpyObj = jasmine.SpyObj;

import { HttpClientModule } from '@angular/common/http';
import { Type } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatCheckboxModule, MatDialogConfig, MatDialogRef,
  MatListModule, MatSidenavModule, MatToolbarModule } from '@angular/material';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from 'src/app/components/app/app.component';
import { LocalStorageService } from 'src/app/services/local_storage/LocalStorageService';
import { DrawingViewModule } from '../../drawing-view.module';
import { ModalWindowComponent } from '../modal-window/modal-window.component';
import { NewDrawingWindowComponent } from '../new-drawing-window/new-drawing-window.component';
import { NewDrawingModalData } from '../NewDrawingModalData';
import { WelcomeWindowComponent } from '../welcome-window/welcome-window.component';
import { CanvasComponent } from './canvas.component';

describe('CanvasComponent', () => {
  let dataMock: SpyObj<NewDrawingModalData>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatListModule,
        MatToolbarModule,
        MatCheckboxModule,
        MatSidenavModule,
        FormsModule,
        DrawingViewModule,
        BrowserDynamicTestingModule,
        BrowserAnimationsModule,
        HttpClientModule,
      ],
      declarations: [
        AppComponent,
        NewDrawingWindowComponent,
        CanvasComponent,
        WelcomeWindowComponent,
        ModalWindowComponent as Type<ModalWindowComponent>,
      ],
      providers: [  MatDialogConfig, LocalStorageService,
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: [dataMock] },
      ],
    }).compileComponents();
  }));

  beforeEach(async(() => {
    dataMock = jasmine.createSpyObj('NewDrawingModalData', ['']);
  }));

  it('should have a defined injected data', () => {
    const fixture = TestBed.createComponent(CanvasComponent);
    const app = fixture.componentInstance;
    app.ngOnInit();
    expect(dataMock).toBeDefined();
  });
});
