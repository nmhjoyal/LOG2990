import SpyObj = jasmine.SpyObj;
import { HttpClientModule } from '@angular/common/http';
import { Type } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatCheckboxModule, MatDialog, MatDialogConfig, MatDialogModule,
  MatIconModule, MatListModule, MatMenuModule, MatSelectModule, MatSidenavModule, MatToolbarModule } from '@angular/material';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// tslint:disable-next-line: max-line-length
import { ColourPaletteComponent } from 'src/app/drawing-view/components/modal-windows/colour-window/colour-palette/colour-palette.component';
import { ColourPickerComponent } from 'src/app/drawing-view/components/modal-windows/colour-window/colour-picker/colour-picker.component';
import { ModalWindowComponent } from 'src/app/drawing-view/components/modal-windows/modal-window/modal-window.component';
import { INewDrawingModalData } from 'src/app/drawing-view/components/modal-windows/new-drawing-window/INewDrawingModalData';
import { NewDrawingWindowComponent } from 'src/app/drawing-view/components/modal-windows/new-drawing-window/new-drawing-window.component';
import { WelcomeWindowComponent } from 'src/app/drawing-view/components/modal-windows/welcome-window/welcome-window.component';
import { Id } from 'src/app/drawing-view/components/tools/assets/constants/tool-constants';
import { DrawingViewModule } from 'src/app/drawing-view/drawing-view.module';
import ClickHelper from 'src/app/helpers/click-helper/click-helper';
import { CanvasInformationService } from 'src/app/services/canvas-information/canvas-information.service';
import { ClipboardService } from 'src/app/services/clipboard/clipboard-service';
import { ColourService } from 'src/app/services/colour_service/colour.service';
import { DrawingStorageService } from 'src/app/services/drawing-storage/drawing-storage.service';
import { LocalStorageService } from 'src/app/services/local_storage/local-storage-service';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
import { GridService } from '../../services/grid/grid.service';
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
  let gridServiceMock: SpyObj<GridService>;
  const elementRefMock = {
    nativeElement: jasmine.createSpyObj('HTMLElement', ['click']),
  };

  let onlyModalOpenSpy: jasmine.Spy;

  beforeEach((() => {
    serviceMock = jasmine.createSpyObj('LocalStorageService', ['getShowAgain']);
    colourMock = jasmine.createSpyObj('ColourService', ['switchColours', 'getPrimaryColour', 'getSecondaryColour']);
    clipboardMock = jasmine.createSpyObj('ClipboardService', ['copy', 'paste', 'cut', 'duplicate', 'delete', 'undo', 'redo']);
    dialogMock = jasmine.createSpyObj('MatDialog', ['open', 'closeAll', 'openDialogs']);
    toolHandlerMock = jasmine.createSpyObj('ToolHandlerService',
    ['resetToolSelection', 'choosePaintbrush', 'chooseCrayon', 'chooseRectangle', 'chooseEllipse', 'choosePolygon', 'chooseText',
    'choosePen', 'chooseQuill', 'chooseEyedropper', 'chooseColourApplicator', 'chooseSelector', 'isUsingText', 'isUsingColourApplicator',
    'chooseEraser', 'chooseBucket']);
    toolHandlerMock.isUsingText.and.callThrough();
    toolHandlerMock.tools = Id;
    drawingStorageMock = jasmine.createSpyObj('DrawingStorageService', ['emptyDrawings', 'isEmpty']);
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
        { provide: GridService, useValue: gridServiceMock },
        { provide: ClipboardService, useValue: clipboardMock },
        { provide: MatDialog, useValue: dialogMock },
        { provide: MAT_DIALOG_DATA, useValue: [dataMock] },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    onlyModalOpenSpy = spyOn(component, 'isOnlyModalOpen');
    onlyModalOpenSpy.and.returnValue(true);
    component.optionsSidebar = jasmine.createSpyObj('MatSidenav', ['']);
    component.optionsSidebar.opened = false;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call click helper getters onMouseMove', () => {
    const getXSpy = spyOn(ClickHelper, 'getXPosition').and.returnValue(1);
    const getYSpy = spyOn(ClickHelper, 'getYPosition').and.returnValue(1);
    component.onMouseMove(new MouseEvent('mousemove'));
    expect(getXSpy).toHaveBeenCalled();
    expect(getYSpy).toHaveBeenCalled();
  });

  it('should open dialog when storage returns true', () => {
    serviceMock.getShowAgain.and.returnValue(true);
    onlyModalOpenSpy.and.returnValue(false);
    component.ngOnInit();
    expect(dialogMock.open).not.toHaveBeenCalled();
    onlyModalOpenSpy.and.returnValue(true);
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

  it('#chooseCrayon should be called when c is pressed', () => {
    toolHandlerMock.chooseCrayon.and.callThrough();
    component.optionsSidebar.opened = true;
    component.onKeydownC();
    expect(toolHandlerMock.chooseCrayon).not.toHaveBeenCalled();
    component.optionsSidebar.opened = false;
    component.onKeydownC();
    expect(toolHandlerMock.chooseCrayon).toHaveBeenCalled();
  });

  it('#chooseQuill should be called when p is pressed', () => {
    toolHandlerMock.chooseQuill.and.callThrough();
    component.optionsSidebar.opened = true;
    component.onKeydownP();
    expect(toolHandlerMock.chooseQuill).not.toHaveBeenCalled();
    component.optionsSidebar.opened = false;
    component.onKeydownP();
    expect(toolHandlerMock.chooseQuill).toHaveBeenCalled();
  });

  it('#choosePaintbrush should be called when w is pressed', () => {
    toolHandlerMock.choosePaintbrush.and.callThrough();
    component.optionsSidebar.opened = true;
    component.onKeydownW();
    expect(toolHandlerMock.choosePaintbrush).not.toHaveBeenCalled();
    component.optionsSidebar.opened = false;
    component.onKeydownW();
    expect(toolHandlerMock.choosePaintbrush).toHaveBeenCalled();
  });

  it('#chooseBucket should be called when b is pressed', () => {
    toolHandlerMock.chooseBucket.and.callThrough();
    component.optionsSidebar.opened = true;
    component.onKeydownB();
    expect(toolHandlerMock.chooseBucket).not.toHaveBeenCalled();
    component.optionsSidebar.opened = false;
    component.onKeydownB();
    expect(toolHandlerMock.chooseBucket).toHaveBeenCalled();
  });

  it('#chooseEyedropper should be called when i is pressed', () => {
    toolHandlerMock.chooseEyedropper.and.callThrough();
    component.optionsSidebar.opened = true;
    component.onKeydownI();
    expect(toolHandlerMock.chooseEyedropper).not.toHaveBeenCalled();
    component.optionsSidebar.opened = false;
    component.onKeydownI();
    expect(toolHandlerMock.chooseEyedropper).toHaveBeenCalled();
  });

  it('#chooseColourApplicator should be called when r is pressed', () => {
    toolHandlerMock.chooseColourApplicator.and.callThrough();
    component.optionsSidebar.opened = true;
    component.onKeydownR();
    expect(toolHandlerMock.chooseColourApplicator).not.toHaveBeenCalled();
    component.optionsSidebar.opened = false;
    component.onKeydownR();
    expect(toolHandlerMock.chooseColourApplicator).toHaveBeenCalled();
  });

  it('#chooseSelector should be called when s is pressed', () => {
    toolHandlerMock.chooseSelector.and.callThrough();
    component.optionsSidebar.opened = true;
    component.onKeydownS();
    expect(toolHandlerMock.chooseSelector).not.toHaveBeenCalled();
    component.optionsSidebar.opened = false;
    component.onKeydownS();
    expect(toolHandlerMock.chooseSelector).toHaveBeenCalled();
  });

  it('#openGalleryWindow should be called when ctrl.G is pressed and no drawings exist', () => {
    const openSpy = spyOn(component, 'openGalleryWindow').and.callFake(() => { return; });
    const event =  new KeyboardEvent('keydown.control.g');
    spyOn(event, 'preventDefault');
    drawingStorageMock.isEmpty.and.returnValue(true);
    onlyModalOpenSpy.and.returnValue(false);
    component.onKeydownCtrlG(event);
    expect(openSpy).not.toHaveBeenCalled();
    onlyModalOpenSpy.and.returnValue(true);
    component.onKeydownCtrlG(event);
    expect(openSpy).toHaveBeenCalled();
  });

  it('#openGalleryWindow should be called when ctrl.G if drawings exist and confirm', () => {
    const openSpy = spyOn(component, 'openGalleryWindow').and.callFake(() => { return; });
    const event =  new KeyboardEvent('keydown.control.g');
    spyOn(event, 'preventDefault');
    drawingStorageMock.isEmpty.and.returnValue(false);
    onlyModalOpenSpy.and.returnValue(true);
    spyOn(window, 'confirm').and.returnValue(false);
    component.onKeydownCtrlG(event);
    expect(openSpy).not.toHaveBeenCalled();
    spyOn(window, 'confirm').and.returnValue(true);
    component.onKeydownCtrlG(event);
    expect(openSpy).toHaveBeenCalled();
  });

  it('#chooseRectangle should be called when 1 is pressed', () => {
    toolHandlerMock.chooseRectangle.and.callThrough();
    component.optionsSidebar.opened = true;
    component.onKeydown1();
    expect(toolHandlerMock.chooseRectangle).not.toHaveBeenCalled();
    component.optionsSidebar.opened = false;
    component.onKeydown1();
    expect(toolHandlerMock.chooseRectangle).toHaveBeenCalled();
  });

  it('#chooseEllipse should be called when 2 is pressed', () => {
    toolHandlerMock.chooseEllipse.and.callThrough();
    component.optionsSidebar.opened = true;
    component.onKeydown2();
    expect(toolHandlerMock.chooseEllipse).not.toHaveBeenCalled();
    component.optionsSidebar.opened = false;
    component.onKeydown2();
    expect(toolHandlerMock.chooseEllipse).toHaveBeenCalled();
  });

  it('#undo should be called only when control+z are pressed and there are no opened dialogs nor optionsBars opened', () => {
    component.optionsSidebar.opened = true;
    onlyModalOpenSpy.and.returnValue(false);
    component.onKeydownCtrlZ();
    expect(clipboardMock.undo).not.toHaveBeenCalled();

    component.optionsSidebar.opened = false;
    onlyModalOpenSpy.and.returnValue(false);
    component.onKeydownCtrlZ();
    expect(clipboardMock.undo).not.toHaveBeenCalled();

    component.optionsSidebar.opened = true;
    onlyModalOpenSpy.and.returnValue(true);
    component.onKeydownCtrlZ();
    expect(clipboardMock.undo).not.toHaveBeenCalled();

    component.optionsSidebar.opened = false;
    onlyModalOpenSpy.and.returnValue(true);
    component.onKeydownCtrlZ();
    expect(clipboardMock.undo).toHaveBeenCalled();
  });

  it('#redo should be called only when control+shift+z are pressed and there are no opened dialogs', () => {
    component.optionsSidebar.opened = false;
    onlyModalOpenSpy.and.returnValue(false);
    component.onKeydownCtrlShiftZ();
    expect(clipboardMock.redo).not.toHaveBeenCalled();

    component.optionsSidebar.opened = true;
    onlyModalOpenSpy.and.returnValue(false);
    component.onKeydownCtrlShiftZ();
    expect(clipboardMock.redo).not.toHaveBeenCalled();

    component.optionsSidebar.opened = true;
    onlyModalOpenSpy.and.returnValue(true);
    component.onKeydownCtrlShiftZ();
    expect(clipboardMock.redo).not.toHaveBeenCalled();

    component.optionsSidebar.opened = false;
    onlyModalOpenSpy.and.returnValue(true);
    component.onKeydownCtrlShiftZ();
    expect(clipboardMock.redo).toHaveBeenCalled();
  });

  it('#choosePolygon should be called when 3 is pressed', () => {
    toolHandlerMock.choosePolygon.and.callThrough();
    component.optionsSidebar.opened = true;
    component.onKeydown3();
    expect(toolHandlerMock.choosePolygon).not.toHaveBeenCalled();
    component.optionsSidebar.opened = false;
    component.onKeydown3();
    expect(toolHandlerMock.choosePolygon).toHaveBeenCalled();
  });

  it('#cut should be called when ctrl.X is pressed', () => {
    clipboardMock.cut.and.callThrough();
    onlyModalOpenSpy.and.returnValue(false);
    component.onKeydownCtrlX();
    expect(clipboardMock.cut).not.toHaveBeenCalled();
    onlyModalOpenSpy.and.returnValue(true);
    component.onKeydownCtrlX();
    expect(clipboardMock.cut).toHaveBeenCalled();
  });

  it('#copy should be called when ctrl.C is pressed', () => {
    clipboardMock.copy.and.callThrough();
    onlyModalOpenSpy.and.returnValue(false);
    component.onKeydownCtrlC();
    expect(clipboardMock.copy).not.toHaveBeenCalled();
    onlyModalOpenSpy.and.returnValue(true);
    component.onKeydownCtrlC();
    expect(clipboardMock.copy).toHaveBeenCalled();
  });

  it('#paste should be called when ctrl.V is pressed', () => {
    clipboardMock.paste.and.callThrough();
    onlyModalOpenSpy.and.returnValue(false);
    component.onKeydownCtrlV();
    expect(clipboardMock.paste).not.toHaveBeenCalled();
    onlyModalOpenSpy.and.returnValue(true);
    component.onKeydownCtrlV();
    expect(clipboardMock.paste).toHaveBeenCalled();
  });

  it('#duplicate should be called when ctrl.D is pressed', () => {
    const event =  new KeyboardEvent('keydown.control.d');
    spyOn(event, 'preventDefault');
    clipboardMock.duplicate.and.callThrough();
    onlyModalOpenSpy.and.returnValue(false);
    component.onKeydownCtrlD(event);
    expect(clipboardMock.duplicate).not.toHaveBeenCalled();
    onlyModalOpenSpy.and.returnValue(true);
    component.onKeydownCtrlD(event);
    expect(clipboardMock.duplicate).toHaveBeenCalled();
  });

  it('#delete should be called when backspace is pressed', () => {
    clipboardMock.delete.and.callThrough();
    onlyModalOpenSpy.and.returnValue(false);
    component.onKeydownBackspace();
    expect(clipboardMock.delete).not.toHaveBeenCalled();
    onlyModalOpenSpy.and.returnValue(true);
    component.onKeydownBackspace();
    expect(clipboardMock.delete).toHaveBeenCalled();
  });

  it('#chooseText should be called when t is pressed', () => {
    toolHandlerMock.chooseText.and.callThrough();
    onlyModalOpenSpy.and.returnValue(false);
    component.onKeydownT();
    expect(toolHandlerMock.chooseText).not.toHaveBeenCalled();
    onlyModalOpenSpy.and.returnValue(true);
    component.onKeydownT();
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

  it('#increaseSize should be called when + is pressed', () => {
    component.onKeydownPlus();
    expect(gridServiceMock.increaseSize).toHaveBeenCalled();
  });

  it('#decreaseSize should be called when - is pressed', () => {
    component.onKeydownMinus();
    expect(gridServiceMock.decreaseSize).toHaveBeenCalled();
  });

  it('#choosePen should be called when y is pressed', () => {
    toolHandlerMock.choosePen.and.callThrough();
    onlyModalOpenSpy.and.returnValue(false);
    component.onKeydownY();
    expect(toolHandlerMock.choosePen).not.toHaveBeenCalled();
    onlyModalOpenSpy.and.returnValue(true);
    component.onKeydownY();
    expect(toolHandlerMock.choosePen).toHaveBeenCalled();
  });

  it('#chooseEraser should be called when e is pressed', () => {
    toolHandlerMock.chooseEraser.and.callThrough();
    onlyModalOpenSpy.and.returnValue(false);
    component.onKeydownE();
    expect(toolHandlerMock.chooseEraser).not.toHaveBeenCalled();
    onlyModalOpenSpy.and.returnValue(true);
    component.onKeydownE();
    expect(toolHandlerMock.chooseEraser).toHaveBeenCalled();
  });

  it('#confirmNewDrawing should be called when ctrl.O is pressed', () => {
    const confirmDrawing = spyOn(component, 'confirmNewDrawing').and.callFake(() => { return; });
    const event =  new KeyboardEvent('keydown.control.o');
    spyOn(event, 'preventDefault');
    onlyModalOpenSpy.and.returnValue(false);
    component.onKeydownCtrlO(event);
    expect(confirmDrawing).not.toHaveBeenCalled();
    onlyModalOpenSpy.and.returnValue(true);
    component.onKeydownCtrlO(event);
    expect(confirmDrawing).toHaveBeenCalled();
  });

  it('#openSaveWindow should be called when ctrl.S is pressed', () => {
    const openDrawing = spyOn(component, 'openSaveWindow').and.callFake(() => { return; });
    const event =  new KeyboardEvent('keydown.control.s');
    spyOn(event, 'preventDefault');
    onlyModalOpenSpy.and.returnValue(false);
    component.onKeydownCtrlS(event);
    expect(openDrawing).not.toHaveBeenCalled();
    onlyModalOpenSpy.and.returnValue(true);
    component.onKeydownCtrlS(event);
    expect(openDrawing).toHaveBeenCalled();
  });

  it('#confirmNewDrawing should open new drawing dialog if no drawings exist', () => {
    const openSpy = spyOn(component, 'openNewDrawingDialog').and.callFake(() => { return; });
    drawingStorageMock.isEmpty.and.returnValue(true);
    onlyModalOpenSpy.and.returnValue(false);
    component.confirmNewDrawing();
    expect(openSpy).not.toHaveBeenCalled();
    onlyModalOpenSpy.and.returnValue(true);
    component.confirmNewDrawing();
    expect(openSpy).toHaveBeenCalled();
  });

  it('#confirmNewDrawing should open new drawing dialog if drawings exist and confirm', () => {
    const openSpy = spyOn(component, 'openNewDrawingDialog').and.callFake(() => { return; });
    drawingStorageMock.isEmpty.and.returnValue(false);
    onlyModalOpenSpy.and.returnValue(true);
    spyOn(window, 'confirm').and.returnValue(false);
    component.confirmNewDrawing();
    expect(openSpy).not.toHaveBeenCalled();
    spyOn(window, 'confirm').and.returnValue(true);
    component.confirmNewDrawing();
    expect(openSpy).toHaveBeenCalled();
  });

  it('#openSaveWindow should open save window dialog', () => {
    onlyModalOpenSpy.and.returnValue(false);
    component.openSaveWindow();
    expect(dialogMock.open).not.toHaveBeenCalled();
    onlyModalOpenSpy.and.returnValue(true);
    component.openSaveWindow();
    expect(dialogMock.open).toHaveBeenCalled();
  });

  it('#openGalleryWindow should open gallery window dialog', () => {
    onlyModalOpenSpy.and.returnValue(false);
    component.openGalleryWindow();
    expect(dialogMock.open).not.toHaveBeenCalled();
    onlyModalOpenSpy.and.returnValue(true);
    component.openGalleryWindow();
    expect(dialogMock.open).toHaveBeenCalled();
  });
});
