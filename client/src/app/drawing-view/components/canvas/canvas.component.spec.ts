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
import { LocalStorageService } from 'src/app/services/local_storage/local-storage-service';
import { DrawingViewModule } from '../../drawing-view.module';
import { ColorPaletteComponent } from '../color-picker/color-palette/color-palette.component';
import { ColorPickerComponent } from '../color-picker/color-picker.component';
import { ModalWindowComponent } from '../modal-windows/modal-window/modal-window.component';
import { INewDrawingModalData } from '../modal-windows/new-drawing-window/INewDrawingModalData';
import { NewDrawingWindowComponent } from '../modal-windows/new-drawing-window/new-drawing-window.component';
import { WelcomeWindowComponent } from '../modal-windows/welcome-window/welcome-window.component';
import { CanvasComponent } from './canvas.component';

describe('CanvasComponent', () => {
  let dataMock: SpyObj<INewDrawingModalData>;

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
        WelcomeWindowComponent,
        ModalWindowComponent as Type<ModalWindowComponent>,
        ColorPaletteComponent,
        ColorPickerComponent,
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

  it('should properly create the component', () => {
    const fixture = TestBed.createComponent(CanvasComponent);
    const app = fixture.componentInstance;
    expect(app).toBeDefined();
  });
});
