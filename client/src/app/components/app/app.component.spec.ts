import SpyObj = jasmine.SpyObj;
import { async } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ModalWindowComponent } from 'src/app/drawing-view/components/modal-window/modal-window.component';
import { NewDrawingModalData } from 'src/app/drawing-view/components/NewDrawingModalData';
import { LocalStorageService } from 'src/app/services/local_storage/LocalStorageService';
import { AppComponent } from './app.component';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';


describe('AppComponent', () => {
  let serviceMock: SpyObj<LocalStorageService>;
  let toolHandlerMock: SpyObj<ToolHandlerService>;
  let dialogMock: SpyObj<MatDialog>;
  let dataMock: SpyObj<NewDrawingModalData>;
  let dialogRefMock: SpyObj<MatDialogRef<ModalWindowComponent>>;
  let component: AppComponent;

  beforeEach(async(() => {
    serviceMock = jasmine.createSpyObj('LocalStorageService', ['getShowAgain', 'setShowAgain']);
    dialogMock = jasmine.createSpyObj('MatDialog', ['open', 'closeAll']);
    dataMock = jasmine.createSpyObj('NewDrawingModalData', ['']);
    dialogRefMock = jasmine.createSpyObj('MatDialogRef<NewDrawingWindowComponent>', ['close']);
    component = new AppComponent(dialogMock, dialogRefMock, serviceMock, toolHandlerMock, dataMock);
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
});
