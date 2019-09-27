import SpyObj = jasmine.SpyObj;
import { MatDialog, MatDialogRef } from '@angular/material';
import { ModalWindowComponent } from 'src/app/drawing-view/components/modal-window/modal-window.component';
import { ModalData } from 'src/app/drawing-view/components/ModalData';
import { LocalStorageService } from 'src/app/services/local_storage/LocalStorageService';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let serviceMock: SpyObj<LocalStorageService>;
  let dialogMock: SpyObj<MatDialog>;
  let dataMock: SpyObj<ModalData>;
  let dialogRefMock: SpyObj<MatDialogRef<ModalWindowComponent>>;
  let component: AppComponent;

  beforeEach(() => {
    serviceMock = jasmine.createSpyObj('LocalStorageService', ['getShowAgain', 'setShowAgain']);
    dialogMock = jasmine.createSpyObj('MatDialog', ['open']);
    dataMock = jasmine.createSpyObj('ModalData', ['data']);
    dialogRefMock = jasmine.createSpyObj('MatDialogRef<ModalWindowComponent>', ['dialogRef']);
    component = new AppComponent(dialogMock, dialogRefMock, serviceMock, dataMock);
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
});
