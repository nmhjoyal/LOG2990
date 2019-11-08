import SpyObj = jasmine.SpyObj;
import { MatDialog } from '@angular/material';
import { INewDrawingModalData } from 'src/app/drawing-view/components/modal-windows/new-drawing-window/INewDrawingModalData';
import { Id } from 'src/app/drawing-view/components/tools/assets/constants/tool-constants';
import { CanvasInformationService } from 'src/app/services/canvas-information/canvas-information.service';
import { ClipboardService } from 'src/app/services/clipboard/clipboard-service';
import { ColorService } from 'src/app/services/color_service/color.service';
import { DrawingStorageService } from 'src/app/services/drawing-storage/drawing-storage.service';
import { LocalStorageService } from 'src/app/services/local_storage/local-storage-service';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
import { AppComponent } from './app.component';
import { UndoRedoService } from 'src/app/services/undo-redo/undo-redo.service';

describe('AppComponent', () => {
  let serviceMock: SpyObj<LocalStorageService>;
  let colorMock: SpyObj<ColorService>;
  let clipboardMock: SpyObj<ClipboardService>;
  let toolHandlerMock: SpyObj<ToolHandlerService>;
  let undoRedoService: SpyObj<UndoRedoService>;
  let drawingStorageMock: SpyObj<DrawingStorageService>;
  let dialogMock: SpyObj<MatDialog>;
  let dataMock: SpyObj<INewDrawingModalData>;
  let canvasMock: SpyObj<CanvasInformationService>;
  let noOpenModalSpy: jasmine.Spy;
  let component: AppComponent;
  const toolId = Id;

  beforeEach(() => {
    serviceMock = jasmine.createSpyObj('LocalStorageService', ['getShowAgain']);
    colorMock = jasmine.createSpyObj('ColorService', ['switchColors']);
    clipboardMock = jasmine.createSpyObj('ClipboardService', ['copy', 'paste', 'cut', 'duplicate', 'delete']);
    dialogMock = jasmine.createSpyObj('MatDialog', ['open', 'closeAll', 'openDialogs']);
    toolHandlerMock = jasmine.createSpyObj('ToolHandlerService',
    ['resetToolSelection', 'choosePaintbrush', 'chooseCrayon', 'chooseRectangle', 'chooseEllipse', 'chooseText',
    'isUsingText']);
    undoRedoService = jasmine.createSpyObj('UndoRedoService', ['undo', 'redo']);
    toolHandlerMock.isUsingText.and.callThrough();
    toolHandlerMock.tools = Id;
    drawingStorageMock = jasmine.createSpyObj('DrawingStorageService', ['emptyDrawings']);
    dataMock = jasmine.createSpyObj('INewDrawingModalData', ['']);
    canvasMock = jasmine.createSpyObj('CanvasInformationService', ['']);
    component = new AppComponent(dialogMock, serviceMock, toolHandlerMock, drawingStorageMock,
      dataMock, canvasMock, colorMock, clipboardMock, undoRedoService);
    spyOn(component, 'isOnlyModalOpen').and.returnValue(true);
    component.optionsSidebar = jasmine.createSpyObj('MatSidenav', ['']);
    component.optionsSidebar.opened = false;
  });

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

  it('should open a new color dialog', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    serviceMock.getShowAgain.and.returnValue(false);
    component.ngOnInit();
    component.openChooseColorDialog();
    expect(dialogMock.open).toHaveBeenCalled();
  });

  it('should only resetSelection when colourApplicator not selected', () => {
    toolHandlerMock.selectedTool = toolId.COLOUR_APPLICATOR;
    toolHandlerMock.resetToolSelection.and.callThrough();
    component.switchColors();
    expect(toolHandlerMock.resetToolSelection).not.toHaveBeenCalled();
  });

  it('#chooseCrayon should be called when c is pressed', () => {
    component.optionsSidebar.opened = false;
    toolHandlerMock.selectedTool = toolId.CRAYON;
    toolHandlerMock.chooseCrayon.and.callThrough();
    component.onKeydownCEvent();
    expect(toolHandlerMock.chooseCrayon).toHaveBeenCalled();
  });

  it('#choosePaintbrush should be called when w is pressed', () => {
    component.optionsSidebar.opened = false;
    toolHandlerMock.selectedTool = toolId.PAINTBRUSH;
    toolHandlerMock.choosePaintbrush.and.callThrough();
    component.onKeydownWEvent();
    expect(toolHandlerMock.choosePaintbrush).toHaveBeenCalled();
  });

  it('#chooseRectangle should be called when 1 is pressed', () => {
    component.optionsSidebar.opened = false;
    toolHandlerMock.selectedTool = toolId.RECTANGLE;
    toolHandlerMock.chooseRectangle.and.callThrough();
    component.onKeydown1();
    expect(toolHandlerMock.chooseRectangle).toHaveBeenCalled();
  });

  it('#chooseEllipse should be called when 2 is pressed', () => {
    component.optionsSidebar.opened = false;
    toolHandlerMock.selectedTool = toolId.ELLIPSE;
    toolHandlerMock.chooseEllipse.and.callThrough();
    noOpenModalSpy.and.returnValue(false);
    component.onKeydown2();
    expect(toolHandlerMock.chooseEllipse).not.toHaveBeenCalled();

    noOpenModalSpy.and.returnValue(true);
    component.onKeydown2();
    expect(toolHandlerMock.chooseEllipse).toHaveBeenCalled();
  });

  it('#undo should be called only when control+z are pressed and there are no opened dialogs nor optionsBars opened', () => {
    component.optionsSidebar.opened = true;
    noOpenModalSpy.and.returnValue(false);
    component.onKeydownCtrlZEvent();
    expect(undoRedoService.undo).not.toHaveBeenCalled();

    component.optionsSidebar.opened = false;
    noOpenModalSpy.and.returnValue(false);
    component.onKeydownCtrlZEvent();
    expect(undoRedoService.undo).not.toHaveBeenCalled();
    
    component.optionsSidebar.opened = true;
    noOpenModalSpy.and.returnValue(true);
    component.onKeydownCtrlZEvent();
    expect(undoRedoService.undo).not.toHaveBeenCalled();

    component.optionsSidebar.opened = false;
    noOpenModalSpy.and.returnValue(true);
    component.onKeydownCtrlZEvent();
    expect(undoRedoService.undo).toHaveBeenCalled();
  });

  it('#redo should be called only when control+shift+z are pressed and there are no opened dialogs', () => {
    component.optionsSidebar.opened = false;
    noOpenModalSpy.and.returnValue(false);
    component.onKeydownCtrlShiftZEvent();
    expect(undoRedoService.redo).not.toHaveBeenCalled();
    
    component.optionsSidebar.opened = true;
    noOpenModalSpy.and.returnValue(false);
    component.onKeydownCtrlShiftZEvent();
    expect(undoRedoService.redo).not.toHaveBeenCalled();

    component.optionsSidebar.opened = true;
    noOpenModalSpy.and.returnValue(true);
    component.onKeydownCtrlShiftZEvent();
    expect(undoRedoService.redo).not.toHaveBeenCalled();

    component.optionsSidebar.opened = false;
    noOpenModalSpy.and.returnValue(true);
    component.onKeydownCtrlShiftZEvent();
    expect(undoRedoService.redo).toHaveBeenCalled();
  });
  
  it('#cut should be called when ctrl.X is pressed', () => {
    component.optionsSidebar.opened = false;
    toolHandlerMock.selectedTool = toolId.SELECTOR;
    clipboardMock.cut.and.callThrough();
    component.onKeydownCtrlX();
    expect(clipboardMock.cut).toHaveBeenCalled();
  });

  it('#copy should be called when ctrl.C is pressed', () => {
    component.optionsSidebar.opened = false;
    toolHandlerMock.selectedTool = toolId.SELECTOR;
    clipboardMock.copy.and.callThrough();
    component.onKeydownCtrlC();
    expect(clipboardMock.copy).toHaveBeenCalled();
  });

  it('#paste should be called when ctrl.V is pressed', () => {
    component.optionsSidebar.opened = false;
    toolHandlerMock.selectedTool = toolId.SELECTOR;
    clipboardMock.paste.and.callThrough();
    component.onKeydownCtrlV();
    expect(clipboardMock.paste).toHaveBeenCalled();
  });

  it('#duplicate should be called when ctrl.D is pressed', () => {
    component.optionsSidebar.opened = false;
    toolHandlerMock.selectedTool = toolId.SELECTOR;
    const event =  new KeyboardEvent('keydown.control.d');
    spyOn(event, 'preventDefault');
    clipboardMock.duplicate.and.callThrough();
    component.onKeydownCtrlD(event);
    expect(clipboardMock.duplicate).toHaveBeenCalled();
  });

  it('#delete should be called when backspace is pressed', () => {
    component.optionsSidebar.opened = false;
    toolHandlerMock.selectedTool = toolId.SELECTOR;
    clipboardMock.delete.and.callThrough();
    component.onKeydownBackspace();
    expect(clipboardMock.delete).toHaveBeenCalled();
  });

  it('#chooseText should be called when t is pressed', () => {
    toolHandlerMock.chooseText.and.callThrough();
    component.onKeydownTEvent();
    expect(toolHandlerMock.chooseText).toHaveBeenCalled();
  });

});
