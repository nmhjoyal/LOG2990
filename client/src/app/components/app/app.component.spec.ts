import SpyObj = jasmine.SpyObj;
import { MatDialog } from '@angular/material';
import { LocalStorageService } from 'src/app/services/local_storage/LocalStorageService';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let serviceMock: SpyObj<LocalStorageService>;
  let dialogMock: SpyObj<MatDialog>;
  let component: AppComponent;

  beforeEach(() => {
    serviceMock = jasmine.createSpyObj('LocalStorageService', ['getShowAgain', 'setShowAgain']);
    dialogMock = jasmine.createSpyObj('MatDialog', ['open']);
    component = new AppComponent(dialogMock, serviceMock);
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
