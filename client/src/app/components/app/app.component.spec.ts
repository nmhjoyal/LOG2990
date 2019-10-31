import SpyObj = jasmine.SpyObj;
import { async } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material';
import { INewDrawingModalData } from 'src/app/drawing-view/components/new-drawing-window/INewDrawingModalData';
import { ColorService } from 'src/app/services/color_service/color.service';
import { LocalStorageService } from 'src/app/services/local_storage/local-storage-service';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let serviceMock: SpyObj<LocalStorageService>;
  let colorServiceMock: SpyObj<ColorService>;
  let toolHandlerMock: SpyObj<ToolHandlerService>;
  let dialogMock: SpyObj<MatDialog>;
  // tslint:disable-next-line:no-any
  let openDialogsSpy: any;
  let dataMock: SpyObj<INewDrawingModalData>;
  let component: AppComponent;

  beforeEach(async(() => {
    serviceMock = jasmine.createSpyObj('LocalStorageService', ['getShowAgain']);
    colorServiceMock = jasmine.createSpyObj('ColorService', ['switchColors']);
    dialogMock = jasmine.createSpyObj('MatDialog', ['open', 'closeAll']);
    toolHandlerMock = jasmine.createSpyObj('ToolHandlerService',
    ['resetSelection', 'choosePaintbrush', 'chooseCrayon', 'chooseRectangle', 'chooseEllipse', 'undo', 'redo']);
    dataMock = jasmine.createSpyObj('INewDrawingModalData', ['']);
    // tslint:disable-next-line:no-any
    openDialogsSpy = spyOnProperty<MatDialogRef<any, any>[]>(dialogMock.openDialogs, "length");
    component = new AppComponent(dialogMock, serviceMock, colorServiceMock, toolHandlerMock, dataMock);

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
    component.switchColours();
    expect(toolHandlerMock.resetSelection).not.toHaveBeenCalled();
  });

  it('#chooseCrayon should be called when c is pressed', () => {
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

  // TODO: add condition of opened toolbox
  it('#undo should be called only when control+z are pressed and there are no opened dialogs', () => {
    openDialogsSpy.and.returnValue(0);
    component.onKeydownCtrlZEvent();
    expect(toolHandlerMock.undo).not.toHaveBeenCalled();
    
    // tslint:disable-next-line:no-magic-numbers
    openDialogsSpy.and.returnValue(1);
    component.onKeydownCtrlZEvent();
    expect(toolHandlerMock.undo).toHaveBeenCalled();
  });

  it('#redo should be called only when control+shift+z are pressed and there are no opened dialogs', () => {
    openDialogsSpy.and.returnValue(0);
    component.onKeydownCtrlShiftZEvent();
    expect(toolHandlerMock.redo).not.toHaveBeenCalled();
    
    // tslint:disable-next-line:no-magic-numbers
    openDialogsSpy.and.returnValue(1);
    component.onKeydownCtrlShiftZEvent();
    expect(toolHandlerMock.redo).toHaveBeenCalled();
  });

});
