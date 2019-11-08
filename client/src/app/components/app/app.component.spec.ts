import SpyObj = jasmine.SpyObj;
import { async } from '@angular/core/testing';
import { MatDialog } from '@angular/material';
import { INewDrawingModalData } from 'src/app/drawing-view/components/modal-windows/new-drawing-window/INewDrawingModalData';
import { Id } from 'src/app/drawing-view/components/tools/assets/constants/tool-constants';
import { CanvasInformationService } from 'src/app/services/canvas-information/canvas-information.service';
import { ClipboardService } from 'src/app/services/clipboard/clipboard-service';
import { ColourService } from 'src/app/services/colour_service/colour.service';
import { DrawingStorageService } from 'src/app/services/drawing-storage/drawing-storage.service';
import { LocalStorageService } from 'src/app/services/local_storage/local-storage-service';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
import { Gridservice } from '../../services/grid/grid.service';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let serviceMock: SpyObj<LocalStorageService>;
  let colourMock: SpyObj<ColourService>;
  let clipboardMock: SpyObj<ClipboardService>;
  let toolHandlerMock: SpyObj<ToolHandlerService>;
  let drawingStorageMock: SpyObj<DrawingStorageService>;
  let dialogMock: SpyObj<MatDialog>;
  let dataMock: SpyObj<INewDrawingModalData>;
  let canvasMock: SpyObj<CanvasInformationService>;
  let component: AppComponent;
  let gridServiceMock: SpyObj<Gridservice>;
  const toolId = Id;

  beforeEach(async(() => {
    serviceMock = jasmine.createSpyObj('LocalStorageService', ['getShowAgain']);
    colourMock = jasmine.createSpyObj('ColourService', ['switchColours']);
    clipboardMock = jasmine.createSpyObj('ClipboardService', ['copy', 'paste', 'cut', 'duplicate', 'delete']);
    dialogMock = jasmine.createSpyObj('MatDialog', ['open', 'closeAll', 'openDialogs']);
    toolHandlerMock = jasmine.createSpyObj('ToolHandlerService',
    ['resetToolSelection', 'choosePaintbrush', 'chooseCrayon', 'chooseRectangle', 'chooseEllipse', 'chooseText',
    'isUsingText']);
    toolHandlerMock.isUsingText.and.callThrough();
    toolHandlerMock.tools = Id;
    drawingStorageMock = jasmine.createSpyObj('DrawingStorageService', ['emptyDrawings']);
    dataMock = jasmine.createSpyObj('INewDrawingModalData', ['']);
    canvasMock = jasmine.createSpyObj('CanvasInformationService', ['']);
    gridServiceMock = jasmine.createSpyObj('GridService', ['']);
    component = new AppComponent(dialogMock, serviceMock, toolHandlerMock, drawingStorageMock,
<<<<<<< HEAD
                                dataMock, canvasMock, colorMock, gridServiceMock, clipboardMock);
=======
      dataMock, canvasMock, colourMock, clipboardMock);
>>>>>>> e0595ebc48991ce37fcc0da7b1d87720166a9be6
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

  it('should only resetSelection when colourApplicator not selected', () => {
    toolHandlerMock.selectedTool = toolId.COLOUR_APPLICATOR;
    toolHandlerMock.resetToolSelection.and.callThrough();
    component.switchColours();
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
    component.onKeydown2();
    expect(toolHandlerMock.chooseEllipse).toHaveBeenCalled();
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
