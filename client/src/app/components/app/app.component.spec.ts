import SpyObj = jasmine.SpyObj;
import { MatDialog } from '@angular/material';
import { INewDrawingModalData } from 'src/app/drawing-view/components/modal-windows/new-drawing-window/INewDrawingModalData';
import { CanvasInformationService } from 'src/app/services/canvas-information/canvas-information.service';
import { ColorService } from 'src/app/services/color_service/color.service';
import { LocalStorageService } from 'src/app/services/local_storage/local-storage-service';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let serviceMock: SpyObj<LocalStorageService>;
  let colorServiceMock: SpyObj<ColorService>;
  let toolHandlerMock: SpyObj<ToolHandlerService>;
  let dialogMock: SpyObj<MatDialog>;
  let dataMock: SpyObj<INewDrawingModalData>;
  let canvasMock: SpyObj<CanvasInformationService>;
  let noOpenModalSpy: jasmine.Spy;
  let component: AppComponent;
  
// TODO: make a testbead in this file

  beforeEach(() => {
    serviceMock = jasmine.createSpyObj('LocalStorageService', ['getShowAgain']);
    colorServiceMock = jasmine.createSpyObj('ColorService', ['switchColors']);
    dialogMock = jasmine.createSpyObj('MatDialog', ['open']); 
    toolHandlerMock = jasmine.createSpyObj('ToolHandlerService',
    ['resetSelection', 'choosePaintbrush', 'chooseCrayon', 'chooseRectangle', 'chooseEllipse', 'chooseText', 'undo', 'redo']);
    dataMock = jasmine.createSpyObj('INewDrawingModalData', ['']);
    canvasMock = jasmine.createSpyObj('CanvasInformationService', ['']);
    component = new AppComponent(dialogMock, serviceMock, toolHandlerMock, dataMock, canvasMock, colorServiceMock);
    noOpenModalSpy = spyOn(component, 'isOnlyModalOpen').and.returnValue(true);
    toolHandlerMock.textSelected = false;
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
    toolHandlerMock.colourApplicatorSelected = true;
    toolHandlerMock.resetSelection.and.callThrough();
    component.switchColors();
    expect(toolHandlerMock.resetSelection).not.toHaveBeenCalled();
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

  it('#chooseEllipse should be called when 2 is pressed and there are no open dialogs', () => {
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
    expect(toolHandlerMock.undo).not.toHaveBeenCalled();

    component.optionsSidebar.opened = false;
    noOpenModalSpy.and.returnValue(false);
    component.onKeydownCtrlZEvent();
    expect(toolHandlerMock.undo).not.toHaveBeenCalled();
    
    component.optionsSidebar.opened = true;
    noOpenModalSpy.and.returnValue(true);
    component.onKeydownCtrlZEvent();
    expect(toolHandlerMock.undo).not.toHaveBeenCalled();

    component.optionsSidebar.opened = false;
    noOpenModalSpy.and.returnValue(true);
    component.onKeydownCtrlZEvent();
    expect(toolHandlerMock.undo).toHaveBeenCalled();
  });

  it('#redo should be called only when control+shift+z are pressed and there are no opened dialogs', () => {
    component.optionsSidebar.opened = false;
    noOpenModalSpy.and.returnValue(false);
    component.onKeydownCtrlShiftZEvent();
    expect(toolHandlerMock.redo).not.toHaveBeenCalled();
    
    component.optionsSidebar.opened = true;
    noOpenModalSpy.and.returnValue(false);
    component.onKeydownCtrlShiftZEvent();
    expect(toolHandlerMock.redo).not.toHaveBeenCalled();

    component.optionsSidebar.opened = true;
    noOpenModalSpy.and.returnValue(true);
    component.onKeydownCtrlShiftZEvent();
    expect(toolHandlerMock.redo).not.toHaveBeenCalled();

    component.optionsSidebar.opened = false;
    noOpenModalSpy.and.returnValue(true);
    component.onKeydownCtrlShiftZEvent();
    expect(toolHandlerMock.redo).toHaveBeenCalled();
  });

  it('#chooseText should be called when t is pressed', () => {
    toolHandlerMock.chooseText.and.callThrough();
    component.onKeydownTEvent();
    expect(toolHandlerMock.chooseText).toHaveBeenCalled();
  });

});
