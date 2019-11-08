import SpyObj = jasmine.SpyObj;
import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatButtonModule, MatDialogModule, MatDialogRef,
  MatFormFieldModule, MatInputModule, MatMenuModule} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CanvasInformationService } from 'src/app/services/canvas-information/canvas-information.service';
import { IndexService } from 'src/app/services/index/index.service';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
import { ISaveModalData } from '../save-window/ISaveModalData';
import { ExportWindowComponent } from './export-window.component';

describe('ExportWindowComponent', () => {
  const dialogRefMock: SpyObj<MatDialogRef<ExportWindowComponent>> = jasmine.createSpyObj('MatDialogRef<ExportWindowComponent>', ['close']);
  let component: ExportWindowComponent;
  let fixture: ComponentFixture<ExportWindowComponent>;
  const dataMock: SpyObj<ISaveModalData> = jasmine.createSpyObj('ISaveModalData', ['']);
  const canvasDataMock: SpyObj<CanvasInformationService> = jasmine.createSpyObj('CanvasInformationService', ['']);
  const toolHandlerMock: SpyObj<ToolHandlerService> = jasmine.createSpyObj('ToolHandlerService', ['clearPage']);
  let indexMock: SpyObj<IndexService>;

  const FORMAT_BMP = 'BMP';
  const FORMAT_SVG = 'SVG';
  const FORMAT_JPG = 'JPG';
  const FORMAT_PNG = 'PNG';

  const dialogMock = {
    close: () => {
        confirm('MockDialog close');
    },
  };

  beforeEach(async(() => {
    indexMock = jasmine.createSpyObj('IndexService', ['basicGet', 'getTags', 'saveTag', 'saveDrawing']);

    TestBed.configureTestingModule({

      declarations: [ ExportWindowComponent ],

      imports: [MatMenuModule,
        HttpClientModule,
        MatDialogModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        BrowserAnimationsModule,
        MatButtonModule, ],

      providers: [
        { provide: MatDialogRef, useValue: { dialogMock } },
        { provide: MAT_DIALOG_DATA, useValue: dataMock },
        { provide: ToolHandlerService, useValue: toolHandlerMock },
        { provide: CanvasInformationService, useValue: canvasDataMock },
        { provide: IndexService, useValue: indexMock }, ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportWindowComponent);
    component = new ExportWindowComponent(dialogRefMock, dataMock, canvasDataMock, toolHandlerMock, indexMock);
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
    expect(component.exportType).toEqual(FORMAT_BMP);
    component.chooseExportType(FORMAT_JPG);
    expect(component.exportType).toEqual(FORMAT_JPG);
    component.chooseExportType(FORMAT_SVG);
    expect(component.exportType).toEqual(FORMAT_SVG);
    component.chooseExportType(FORMAT_PNG);
    expect(component.exportType).toEqual(FORMAT_PNG);
  });
});
