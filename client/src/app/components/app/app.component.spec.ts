import SpyObj = jasmine.SpyObj;
import { HttpClientModule } from '@angular/common/http';
import { Type } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatCheckboxModule, MatDialog, MatDialogConfig, MatDialogModule,
  MatIconModule, MatListModule, MatMenuModule, MatSelectModule, MatSidenavModule, MatToolbarModule } from '@angular/material';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ColourPaletteComponent } from 'src/app/drawing-view/components/colour-picker/colour-palette/colour-palette.component';
import { ColourPickerComponent } from 'src/app/drawing-view/components/colour-picker/colour-picker.component';
import { ModalWindowComponent } from 'src/app/drawing-view/components/modal-windows/modal-window/modal-window.component';
import { INewDrawingModalData } from 'src/app/drawing-view/components/modal-windows/new-drawing-window/INewDrawingModalData';
import { NewDrawingWindowComponent } from 'src/app/drawing-view/components/modal-windows/new-drawing-window/new-drawing-window.component';
import { WelcomeWindowComponent } from 'src/app/drawing-view/components/modal-windows/welcome-window/welcome-window.component';
import { Id } from 'src/app/drawing-view/components/tools/assets/constants/tool-constants';
import { DrawingViewModule } from 'src/app/drawing-view/drawing-view.module';
import { CanvasInformationService } from 'src/app/services/canvas-information/canvas-information.service';
import { ClipboardService } from 'src/app/services/clipboard/clipboard-service';
import { ColourService } from 'src/app/services/colour_service/colour.service';
import { DrawingStorageService } from 'src/app/services/drawing-storage/drawing-storage.service';
import { LocalStorageService } from 'src/app/services/local_storage/local-storage-service';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
import { Gridservice } from '../../services/grid/grid.service';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let serviceMock: SpyObj<LocalStorageService>;
  let colourMock: SpyObj<ColourService>;
  let clipboardMock: SpyObj<ClipboardService>;
  let toolHandlerMock: SpyObj<ToolHandlerService>;
  let drawingStorageMock: SpyObj<DrawingStorageService>;
  let dialogMock: SpyObj<MatDialog>;
  let dataMock: SpyObj<INewDrawingModalData>;
  let canvasMock: SpyObj<CanvasInformationService>;
  let gridServiceMock: SpyObj<Gridservice>;

  const elementRefMock = {
    nativeElement: jasmine.createSpyObj('HTMLElement', ['click']),
  };

  beforeEach((() => {
    serviceMock = jasmine.createSpyObj('LocalStorageService', ['getShowAgain']);
    colourMock = jasmine.createSpyObj('ColourService', ['switchColours']);
    clipboardMock = jasmine.createSpyObj('ClipboardService', ['copy', 'paste', 'cut', 'duplicate', 'delete']);
    dialogMock = jasmine.createSpyObj('MatDialog', ['open', 'closeAll', 'openDialogs']);
    toolHandlerMock = jasmine.createSpyObj('ToolHandlerService',
    ['resetToolSelection', 'choosePaintbrush', 'chooseCrayon', 'chooseRectangle', 'chooseEllipse', 'chooseText',
    'isUsingText', 'isUsingColourApplicator']);
    toolHandlerMock.isUsingText.and.callThrough();
    toolHandlerMock.tools = Id;
    drawingStorageMock = jasmine.createSpyObj('DrawingStorageService', ['emptyDrawings']);
    dataMock = jasmine.createSpyObj('INewDrawingModalData', ['']);
    canvasMock = jasmine.createSpyObj('CanvasInformationService', ['']);
    gridServiceMock = jasmine.createSpyObj('Gridservice', ['increaseSize', 'decreaseSize', 'toggleGrid']);
    TestBed.configureTestingModule({
      imports: [
        MatDialogModule,
        MatListModule,
        MatToolbarModule,
        MatCheckboxModule,
        MatSidenavModule,
        MatMenuModule,
        MatIconModule,
        MatSelectModule,
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
        ColourPaletteComponent,
        ColourPickerComponent,
      ],
      providers: [  MatDialogConfig,
        { provide: LocalStorageService, useValue: serviceMock },
        { provide: DrawingStorageService, useValue: drawingStorageMock },
        { provide: ToolHandlerService, useValue: toolHandlerMock },
        { provide: ColourService, useValue: colourMock },
        { provide: CanvasInformationService, useValue: canvasMock },
        { provide: Gridservice, useValue: gridServiceMock },
        { provide: ClipboardService, useValue: clipboardMock },
        { provide: MatDialog, useValue: dialogMock },
        { provide: MAT_DIALOG_DATA, useValue: [dataMock] },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    spyOn(component, 'isOnlyModalOpen').and.returnValue(true);
    component.optionsSidebar = jasmine.createSpyObj('MatSidenav', ['']);
    component.optionsSidebar.opened = false;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open dialog when storage returns true', () => {
    serviceMock.getShowAgain.and.returnValue(true);
    component.ngOnInit();
    expect(dialogMock.open).toHaveBeenCalled();
  });

  it('should not open dialog when storage returns false', () => {
    serviceMock.getShowAgain.and.returnValue(false);
    component.openWelcomeScreen();
    expect(dialogMock.open).not.toHaveBeenCalled();
  });

  it('should open a new drawing dialog', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    serviceMock.getShowAgain.and.returnValue(false);
    component.ngOnInit();
    component.openNewDrawingDialog();
    expect(dialogMock.open).toHaveBeenCalled();
  });

  it('should open a new colour dialog', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    serviceMock.getShowAgain.and.returnValue(false);
    component.ngOnInit();
    component.openChooseColourDialog();
    expect(dialogMock.open).toHaveBeenCalled();
  });

  it('should only resetToolSelection when colourApplicator not selected', () => {
    toolHandlerMock.isUsingColourApplicator.and.returnValue(true);
    component.switchColours();
    expect(toolHandlerMock.resetToolSelection).not.toHaveBeenCalled();
  });

  it('#chooseCrayon should be called when c is pressed', () => {
    toolHandlerMock.chooseCrayon.and.callThrough();
    component.onKeydownCEvent();
    expect(toolHandlerMock.chooseCrayon).toHaveBeenCalled();
  });

  it('#choosePaintbrush should be called when w is pressed', () => {
    toolHandlerMock.choosePaintbrush.and.callThrough();
    component.onKeydownWEvent();
    expect(toolHandlerMock.choosePaintbrush).toHaveBeenCalled();
  });

  it('#chooseRectangle should be called when 1 is pressed', () => {
    toolHandlerMock.chooseRectangle.and.callThrough();
    component.onKeydown1();
    expect(toolHandlerMock.chooseRectangle).toHaveBeenCalled();
  });

  it('#chooseEllipse should be called when 2 is pressed', () => {
    toolHandlerMock.chooseEllipse.and.callThrough();
    component.onKeydown2();
    expect(toolHandlerMock.chooseEllipse).toHaveBeenCalled();
  });

  it('#cut should be called when ctrl.X is pressed', () => {
    clipboardMock.cut.and.callThrough();
    component.onKeydownCtrlX();
    expect(clipboardMock.cut).toHaveBeenCalled();
  });

  it('#copy should be called when ctrl.C is pressed', () => {
    clipboardMock.copy.and.callThrough();
    component.onKeydownCtrlC();
    expect(clipboardMock.copy).toHaveBeenCalled();
  });

  it('#paste should be called when ctrl.V is pressed', () => {
    clipboardMock.paste.and.callThrough();
    component.onKeydownCtrlV();
    expect(clipboardMock.paste).toHaveBeenCalled();
  });

  it('#duplicate should be called when ctrl.D is pressed', () => {
    const event =  new KeyboardEvent('keydown.control.d');
    spyOn(event, 'preventDefault');
    clipboardMock.duplicate.and.callThrough();
    component.onKeydownCtrlD(event);
    expect(clipboardMock.duplicate).toHaveBeenCalled();
  });

  it('#delete should be called when backspace is pressed', () => {
    clipboardMock.delete.and.callThrough();
    component.onKeydownBackspace();
    expect(clipboardMock.delete).toHaveBeenCalled();
  });

  it('#chooseText should be called when t is pressed', () => {
    toolHandlerMock.chooseText.and.callThrough();
    component.onKeydownTEvent();
    expect(toolHandlerMock.chooseText).toHaveBeenCalled();
  });

  it('#toggleGrid should be called when g is pressed', () => {
    elementRefMock.nativeElement.click.and.callFake(() => { return; });
    component.toggle = elementRefMock;
    component.onKeydownG();
    expect(elementRefMock.nativeElement.click).toHaveBeenCalled();
  });

  it('#increaseSize should be called when Shift+ is pressed', () => {
    component.onKeydownShiftPlus();
    expect(gridServiceMock.increaseSize).toHaveBeenCalled();
  });

  it('#decreaseSize should be called when Shift- is pressed', () => {
    component.onKeydownShiftMinus();
    expect(gridServiceMock.decreaseSize).toHaveBeenCalled();
  });

});
