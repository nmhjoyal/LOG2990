import SpyObj = jasmine.SpyObj;
import { async } from '@angular/core/testing';
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
  let component: AppComponent;

  beforeEach(async(() => {
    serviceMock = jasmine.createSpyObj('LocalStorageService', ['getShowAgain']);
    colorServiceMock = jasmine.createSpyObj('ColorService', ['switchColors']);
    dialogMock = jasmine.createSpyObj('MatDialog', ['open', 'closeAll']);
    toolHandlerMock = jasmine.createSpyObj('ToolHandlerService', ['']);
    dataMock = jasmine.createSpyObj('INewDrawingModalData', ['']);
    canvasMock = jasmine.createSpyObj('CanvasInformationService', ['']);
    component = new AppComponent(dialogMock, serviceMock, toolHandlerMock, dataMock, canvasMock, colorServiceMock);
  }));

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

});
