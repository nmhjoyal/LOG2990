import SpyObj = jasmine.SpyObj;
import { async } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material';
// import { ModalWindowComponent } from 'src/app/drawing-view/components/modal-window/modal-window.component';
import { NewDrawingWindowComponent } from 'src/app/drawing-view/components/new-drawing-window/new-drawing-window.component';
import { NewDrawingModalData } from 'src/app/drawing-view/components/NewDrawingModalData';
import { ColorService } from 'src/app/services/color_service/color.service';
import { LocalStorageService } from 'src/app/services/local_storage/LocalStorageService';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let localServiceMock: SpyObj<LocalStorageService>;
  let colorServiceMock: SpyObj<ColorService>;
  let dialogMock: SpyObj<MatDialog>;
  let dataMock: SpyObj<NewDrawingModalData>;
  let dialogRefMock: SpyObj<MatDialogRef<NewDrawingWindowComponent>>;
  let component: AppComponent;

  beforeEach(async(() => {
    localServiceMock = jasmine.createSpyObj('LocalStorageService', ['getShowAgain', 'setShowAgain']);
    colorServiceMock = jasmine.createSpyObj('ColorService', ['getShowAgain', 'setShowAgain']);
    dialogMock = jasmine.createSpyObj('MatDialog', ['open', 'closeAll']);
    dataMock = jasmine.createSpyObj('NewDrawingModalData', ['']);
    dialogRefMock = jasmine.createSpyObj('MatDialogRef<NewDrawingWindowComponent>', ['close']);
    component = new AppComponent(dialogMock, dialogRefMock, localServiceMock, colorServiceMock, dataMock);
  }));

  it('should open dialog when storage returns true', () => {
    localServiceMock.getShowAgain.and.returnValue(true);
    component.ngOnInit();
    expect(dialogMock.open).toHaveBeenCalled();
  });

  it('should not open dialog when storage returns false', () => {
    localServiceMock.getShowAgain.and.returnValue(false);
    component.openWelcomeScreen();
    expect(dialogMock.open).not.toHaveBeenCalled();
  });

  it('should open a new drawing dialog', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    localServiceMock.getShowAgain.and.returnValue(false);
    component.ngOnInit();
    component.openNewDrawingDialog();
    expect(dialogMock.open).toHaveBeenCalled();
  });

  it('should open a new color dialog', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    localServiceMock.getShowAgain.and.returnValue(false);
    component.ngOnInit();
    component.openChooseColorDialog();
    expect(dialogMock.open).toHaveBeenCalled();

  });
});
