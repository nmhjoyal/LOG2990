import SpyObj = jasmine.SpyObj;
import { async } from '@angular/core/testing';
import { MatDialog } from '@angular/material';
import { INewDrawingModalData } from 'src/app/drawing-view/components/new-drawing-window/INewDrawingModalData';
import { LocalStorageService } from 'src/app/services/local_storage/local-storage-service';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let serviceMock: SpyObj<LocalStorageService>;
  let dialogMock: SpyObj<MatDialog>;
  let dataMock: SpyObj<INewDrawingModalData>;
  let component: AppComponent;

  beforeEach(async(() => {
    serviceMock = jasmine.createSpyObj('LocalStorageService', ['getShowAgain', 'setShowAgain']);
    dialogMock = jasmine.createSpyObj('MatDialog', ['open', 'closeAll']);
    dataMock = jasmine.createSpyObj('NewDrawingModalData', ['']);
    component = new AppComponent(dialogMock, serviceMock, dataMock);
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
