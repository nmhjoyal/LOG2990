import { AppComponent } from './app.component';

describe('AppComponent', () => {
  const serviceMock = jasmine.createSpyObj('LocalStorageService', ['getShowAgain', 'setShowAgain']);
  const dialogMock = jasmine.createSpyObj('MatDialog', ['open']);
  let component: AppComponent;

  beforeEach(() => {
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
