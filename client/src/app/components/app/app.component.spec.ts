import SpyObj = jasmine.SpyObj;
import { async } from '@angular/core/testing';
import { MatDialog } from '@angular/material';
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
  let dataMock: SpyObj<INewDrawingModalData>;
  let component: AppComponent;

  beforeEach(async(() => {
    serviceMock = jasmine.createSpyObj('LocalStorageService', ['getShowAgain']);
    colorServiceMock = jasmine.createSpyObj('ColorService', ['switchColors']);
    dialogMock = jasmine.createSpyObj('MatDialog', ['open', 'closeAll']);
    toolHandlerMock = jasmine.createSpyObj('ToolHandlerService', ['resetSelection']);
    dataMock = jasmine.createSpyObj('INewDrawingModalData', ['']);
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
    const spy = spyOn(toolHandlerMock, 'chooseCrayon');
    component.onKeydownCEvent();
    expect(spy).toHaveBeenCalled();
  });

  it('#choosePaintbrush should be called when w is pressed', () => {
    const spy = spyOn(toolHandlerMock, 'choosePaintbrush');
    component.onKeydownWEvent();
    expect(spy).toHaveBeenCalled();
  });

  it('#chooseRectangle should be called when 1 is pressed', () => {
    const spy = spyOn(toolHandlerMock, 'chooseRectangle');
    component.onKeydown1();
    expect(spy).toHaveBeenCalled();
  });

  it('#chooseEllipse should be called when 2 is pressed', () => {
    const spy = spyOn(toolHandlerMock, 'chooseEllipse');
    component.onKeydown2();
    expect(spy).toHaveBeenCalled();
  });

});
