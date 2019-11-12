
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
import { CanvasInformationService } from 'src/app/services/canvas-information/canvas-information.service';
import { ExportInformationService } from 'src/app/services/export-information/export-information.service';
import { ExportAs } from 'src/AppConstants/Strings';
import { ExportWindowComponent } from './export-window.component';

describe('ExportWindowComponent', () => {
  const dialogRefMock: SpyObj<MatDialogRef<ExportWindowComponent>> = jasmine.createSpyObj('MatDialogRef<ExportWindowComponent>', ['close']);
  let component: ExportWindowComponent;
  let fixture: ComponentFixture<ExportWindowComponent>;
  const exportDataMock: SpyObj<ExportInformationService> = jasmine.createSpyObj('ExportInformationService', ['']);
  const canvasDataMock: SpyObj<CanvasInformationService> = jasmine.createSpyObj('CanvasInformationService', ['']);
  const mockContext: SpyObj<CanvasRenderingContext2D> = jasmine.createSpyObj('CanvasRenderingContext2D', ['']);

  const FORMAT_BMP = ExportAs.BMP;
  const FORMAT_SVG = ExportAs.SVG;
  const FORMAT_JPG = ExportAs.JPG;
  const FORMAT_PNG = ExportAs.PNG;

  const dialogMock = {
    close: () => {
      confirm('MockDialog close');
    },
  };

  canvasDataMock.data = {
    drawingColour: '',
    drawingHeight: 0,
    drawingWidth: 0,
  };

  exportDataMock.data = jasmine.createSpyObj('IExportData', ['']);

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
        MatButtonModule,
      ],

      providers: [
        { provide: MatDialogRef, useValue: { dialogMock } },
        { provide: MAT_DIALOG_DATA, useValue: exportDataMock },
        { provide: CanvasInformationService, useValue: canvasDataMock },
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportWindowComponent);
    component = new ExportWindowComponent(dialogRefMock, exportDataMock, canvasDataMock);
    component['formatSelected'] = false;
    component['exportType'] = '';
    exportDataMock.data.canvasElement = jasmine.createSpyObj('ElementRef<SVGElement>', ['']);
    exportDataMock.data.canvasElement.nativeElement = jasmine.createSpyObj('SVGElement as Node', ['']);

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
    expect(component['exportType']).toEqual(FORMAT_BMP, 'exportType took ExportAs.BMP value');
    expect(component['format']).toEqual(FORMAT_BMP, 'format took ExportAs.BMP value');

    component.chooseExportType(FORMAT_JPG);
    expect(component['exportType']).toEqual(FORMAT_JPG, 'exportType took ExportAs.JPG value');
    expect(component['format']).toEqual(FORMAT_JPG, 'format took ExportAs.BMP value');

    component.chooseExportType(FORMAT_SVG);
    expect(component['exportType']).toEqual(FORMAT_SVG, 'exportType took ExportAs.SVG value');
    expect(component['format']).toEqual(FORMAT_SVG, 'format took ExportAs.BMP value');

    component.chooseExportType(FORMAT_PNG);
    expect(component['exportType']).toEqual(FORMAT_PNG, 'exportType took ExportAs.PNG value');
    expect(component['format']).toEqual(FORMAT_PNG, 'format took ExportAs.BMP value');
  });

  it('#onAcceptClick should do nothing if the format isnt selected', () => {
    const spy1 = spyOn(component, 'download');
    const spy2 = spyOn(component, 'drawImage');
    component.onAcceptClick();
    expect(spy1).not.toHaveBeenCalled();
    expect(spy2).not.toHaveBeenCalled();
  });

  // it('#onAcceptClick should call download if SVG is selected', () => {
  //   const spy = spyOn(component, 'download');

  //   component.chooseExportType(FORMAT_SVG);
  //   component.onAcceptClick();
  //   expect(spy).toHaveBeenCalled();
  // });

  // it('#onAcceptClick should call drawImage if PNG is selected', () => {
  //   const spy = spyOn(component, 'drawImage');

  //   component.chooseExportType(FORMAT_PNG);
  //   component.onAcceptClick();
  //   expect(spy).toHaveBeenCalled();
  // });

  // it('#onAcceptClick should call drawImage if JPG is selected', () => {
  //   const spy = spyOn(component, 'drawImage');

  //   component.chooseExportType(FORMAT_JPG);
  //   component.onAcceptClick();
  //   expect(spy).toHaveBeenCalled();
  // });

  // it('#onAcceptClick should call drawImage if BMP is selected', () => {
  //   const spy = spyOn(component, 'drawImage');

  //   component.chooseExportType(FORMAT_BMP);
  //   component.onAcceptClick();
  //   expect(spy).toHaveBeenCalled();
  // });

  it('#drawImage should retrieve attributes properly', () => {
    const spyContext = spyOn(component, 'drawImage');
    component['context'] = mockContext;
    const img = new Image();
    component['exportType'] = component['exportTypeEnum'].JPG;
    const a = document.createElement('a');
    component.drawImage('mock');
    expect(img.width).toEqual(component['width']);
    expect(img.height).toEqual(component['height']);
    expect(img.src).toBeDefined();
    expect(spyContext).toHaveBeenCalled();
    expect(a.href).toBeDefined();
  });

  it('#drawImage should retrieve attributes properly', () => {
    // const spyContext = spyOn(, 'CanvasToBmp');
    component['context'] = mockContext;
    const img = new Image();
    component['exportType'] = component['exportTypeEnum'].BMP;
    const a = document.createElement('a');
    component.drawImage('mock');
    expect(img.width).toEqual(component['width']);
    expect(img.height).toEqual(component['height']);
    expect(img.src).toBeDefined();
    // expect(spyContext).toHaveBeenCalled();
    expect(a.href).toBeDefined();
  });


  it('#download should properly create', () => {
    const spyRemove = spyOn(document.body, 'removeChild');
    const elem = document.createElement('a');

    const fileContent = 'some information here!';
    const data = new Blob([fileContent], { type: 'text/plain' });

    component.download('name', data);

    expect(spyRemove).toHaveBeenCalled();
    expect(elem.href).toBeDefined();
  });

});
