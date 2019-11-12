
// tslint:disable: no-string-literal
import SpyObj = jasmine.SpyObj;
import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA, MatButtonModule, MatDialogModule, MatDialogRef,
  MatFormFieldModule, MatInputModule, MatMenuModule
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ExportAs } from 'src/AppConstants/Strings';
import { ExportWindowComponent } from './export-window.component';
import { IExportData } from './IExportData';
import { CanvasInformationService } from 'src/app/services/canvas-information/canvas-information.service';

describe('ExportWindowComponent', () => {
  const dialogRefMock: SpyObj<MatDialogRef<ExportWindowComponent>> = jasmine.createSpyObj('MatDialogRef<ExportWindowComponent>', ['close']);
  let component: ExportWindowComponent;
  let fixture: ComponentFixture<ExportWindowComponent>;
  const dataMock: SpyObj<IExportData> = jasmine.createSpyObj('IExportData', ['']);

  const FORMAT_BMP = ExportAs.BMP;
  const FORMAT_SVG = ExportAs.SVG;
  const FORMAT_JPG = ExportAs.JPG;
  const FORMAT_PNG = ExportAs.PNG;

  const dialogMock = {
    close: () => {
      confirm('MockDialog close');
    },
  };

  beforeEach(async(() => {

    TestBed.configureTestingModule({

      declarations: [ExportWindowComponent],

      imports: [MatMenuModule,
        HttpClientModule,
        MatDialogModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        BrowserAnimationsModule,
        MatButtonModule, ],

      providers: [
        CanvasInformationService,
        { provide: MatDialogRef, useValue: { dialogMock } },
        { provide: MAT_DIALOG_DATA, useValue: dataMock }, ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportWindowComponent);
    component = fixture.componentInstance
    component['formatSelected'] = false;
    component['exportType'] = ExportAs.SVG;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#onClose should call dialogRef.close', () => {
    component.onClose();
    expect(dialogRefMock.close).toHaveBeenCalled();
  });

  it('#chooseExportType should assign right format to exportType', () => {
    component.chooseExportType(FORMAT_BMP);
    expect(component['exportType']).toEqual(FORMAT_BMP);
    component.chooseExportType(FORMAT_JPG);
    expect(component['exportType']).toEqual(FORMAT_JPG);
    component.chooseExportType(FORMAT_SVG);
    expect(component['exportType']).toEqual(FORMAT_SVG);
    component.chooseExportType(FORMAT_PNG);
    expect(component['exportType']).toEqual(FORMAT_PNG);
  });

  it('#onAcceptClick should call download if the format is selected', () => {
    const spy = spyOn(component, 'download');
    component.onAcceptClick();
    expect(spy).toHaveBeenCalled();
  });
});
