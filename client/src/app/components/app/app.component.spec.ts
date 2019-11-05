import SpyObj = jasmine.SpyObj;
import { async } from '@angular/core/testing';
import { MatDialog } from '@angular/material';
import { INewDrawingModalData } from 'src/app/drawing-view/components/modal-windows/new-drawing-window/INewDrawingModalData';
import { CanvasInformationService } from 'src/app/services/canvas-information/canvas-information.service';
import { ColorService } from 'src/app/services/color_service/color.service';
import { LocalStorageService } from 'src/app/services/local_storage/local-storage-service';
import { SelectorService } from 'src/app/services/selector-service/selector-service';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let serviceMock: SpyObj<LocalStorageService>;
  let colorMock: SpyObj<ColorService>;
  let selectorMock: SpyObj<SelectorService>;
  let toolHandlerMock: SpyObj<ToolHandlerService>;
  let dialogMock: SpyObj<MatDialog>;
  let dataMock: SpyObj<INewDrawingModalData>;
  let canvasMock: SpyObj<CanvasInformationService>;
  let component: AppComponent;

  beforeEach(async(() => {
    serviceMock = jasmine.createSpyObj('LocalStorageService', ['getShowAgain']);
    colorMock = jasmine.createSpyObj('ColorService', ['switchColors']);
    selectorMock = jasmine.createSpyObj('SelectorService', ['copy', 'paste', 'cut', 'duplicate', 'delete']);
    dialogMock = jasmine.createSpyObj('MatDialog', ['open', 'closeAll', 'openDialogs']);
    toolHandlerMock = jasmine.createSpyObj('ToolHandlerService',
    ['resetSelection', 'choosePaintbrush', 'chooseCrayon', 'chooseRectangle', 'chooseEllipse']);
    dataMock = jasmine.createSpyObj('INewDrawingModalData', ['']);
    canvasMock = jasmine.createSpyObj('CanvasInformationService', ['']);
    component = new AppComponent(dialogMock, serviceMock, toolHandlerMock, dataMock, canvasMock, colorMock, selectorMock);
    spyOn(component, 'isOnlyModalOpen').and.returnValue(true);
    component.optionsSidebar = jasmine.createSpyObj('MatSidenav', ['']);
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

  it('should open a new color dialog', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    serviceMock.getShowAgain.and.returnValue(false);
    component.ngOnInit();
    component.openChooseColorDialog();
    expect(dialogMock.open).toHaveBeenCalled();
  });

  it('should only resetSelection when colourApplicator not selected', () => {
    toolHandlerMock.colourApplicatorSelected = true;
    toolHandlerMock.resetSelection.and.callThrough();
    component.switchColors();
    expect(toolHandlerMock.resetSelection).not.toHaveBeenCalled();
  });

  it('#chooseCrayon should be called when c is pressed', () => {
    component.optionsSidebar.opened = false;
    toolHandlerMock.crayonSelected = true;
    toolHandlerMock.chooseCrayon.and.callThrough();
    component.onKeydownCEvent();
    expect(toolHandlerMock.chooseCrayon).toHaveBeenCalled();
  });

  it('#choosePaintbrush should be called when w is pressed', () => {
    component.optionsSidebar.opened = false;
    toolHandlerMock.paintbrushSelected = true;
    toolHandlerMock.choosePaintbrush.and.callThrough();
    component.onKeydownWEvent();
    expect(toolHandlerMock.choosePaintbrush).toHaveBeenCalled();
  });

  it('#chooseRectangle should be called when 1 is pressed', () => {
    component.optionsSidebar.opened = false;
    toolHandlerMock.rectangleSelected = true;
    toolHandlerMock.chooseRectangle.and.callThrough();
    component.onKeydown1();
    expect(toolHandlerMock.chooseRectangle).toHaveBeenCalled();
  });

  it('#chooseEllipse should be called when 2 is pressed', () => {
    component.optionsSidebar.opened = false;
    toolHandlerMock.ellipseSelected = true;
    toolHandlerMock.chooseEllipse.and.callThrough();
    component.onKeydown2();
    expect(toolHandlerMock.chooseEllipse).toHaveBeenCalled();
  });

  it('#cut should be called when ctrl.X is pressed', () => {
    component.optionsSidebar.opened = false;
    toolHandlerMock.selectorSelected = true;
    selectorMock.cut.and.callThrough();
    component.onKeydownCtrlX();
    expect(selectorMock.cut).toHaveBeenCalled();
  });

  it('#copy should be called when ctrl.C is pressed', () => {
    component.optionsSidebar.opened = false;
    toolHandlerMock.selectorSelected = true;
    selectorMock.copy.and.callThrough();
    component.onKeydownCtrlC();
    expect(selectorMock.copy).toHaveBeenCalled();
  });

  it('#paste should be called when ctrl.V is pressed', () => {
    component.optionsSidebar.opened = false;
    toolHandlerMock.selectorSelected = true;
    selectorMock.paste.and.callThrough();
    component.onKeydownCtrlV();
    expect(selectorMock.paste).toHaveBeenCalled();
  });

  it('#duplicate should be called when ctrl.D is pressed', () => {
    component.optionsSidebar.opened = false;
    toolHandlerMock.selectorSelected = true;
    selectorMock.duplicate.and.callThrough();
    component.onKeydownCtrlD();
    expect(selectorMock.duplicate).toHaveBeenCalled();
  });

  it('#delete should be called when backspace is pressed', () => {
    component.optionsSidebar.opened = false;
    toolHandlerMock.selectorSelected = true;
    selectorMock.delete.and.callThrough();
    component.onKeydownBackspace();
    expect(selectorMock.delete).toHaveBeenCalled();
  });

});
