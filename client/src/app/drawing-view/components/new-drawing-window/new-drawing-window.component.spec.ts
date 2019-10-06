import SpyObj = jasmine.SpyObj;
import { HttpClientModule } from '@angular/common/http';
import { ChangeDetectionStrategy } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatButtonModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppConstants } from 'src/AppConstants';
import { INewDrawingModalData } from '../INewDrawingModalData';
import { ModalWindowComponent } from '../modal-window/modal-window.component';
import { NewDrawingWindowComponent } from './new-drawing-window.component';

describe('NewDrawingWindowComponent', () => {
  let dataMock: SpyObj<INewDrawingModalData>;
  let dialogRefMock: SpyObj<MatDialogRef<NewDrawingWindowComponent>>;
  let component: NewDrawingWindowComponent;
  let fixture: ComponentFixture<NewDrawingWindowComponent>;
  dataMock = jasmine.createSpyObj('NewDrawingModalData', ['']);

  const NEW_WINDOW_SIZE = 500;
  const MOCK_USER_INPUT = 200;

  const dialogMock = {
    close: () => {
      confirm('MockDialog close');
    },
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        MatDialogModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        BrowserAnimationsModule,
        MatButtonModule,
      ],
      declarations: [
        ModalWindowComponent,
        NewDrawingWindowComponent,
      ],
      providers: [
        { provide: MatDialogRef, useValue: dialogMock },
        { provide: MAT_DIALOG_DATA, useValue: dataMock },
      ],
    })
      .overrideComponent(NewDrawingWindowComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewDrawingWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(async(() => {
    dialogRefMock = jasmine.createSpyObj('MatDialogRef<NewDrawingWindowComponent>', ['close']);
    component = new NewDrawingWindowComponent(dialogRefMock, dataMock);
    component.ngOnInit();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set all input variables to undefined on reinitializing -- not keep values for next modal window', () => {
    component.reinitializeDrawingVariables();
    expect(dataMock.drawingColorInput).toBeUndefined();
    expect(dataMock.drawingHeightInput).toBeUndefined();
    expect(dataMock.drawingWidthInput).toBeUndefined();
  });

  it('should open a confirmation with message `Êtes-vous certain.e de vouloir quitter et perdre vos changements?`', () => {
    spyOn(window, 'confirm');
    component.confirmExit();
    expect(window.confirm).toHaveBeenCalledWith('Êtes-vous certain.e de vouloir quitter et perdre vos changements?');
  });

  it('should automatically close the dialog if the user did not input values', () => {
    const spyClose = spyOn(window, 'confirm');
    component.reinitializeDrawingVariables();
    component.onClose();
    expect(spyClose).not.toHaveBeenCalled();
  });

  it('should prompt the user before closing if there are values in the dialog, and then close it', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    dataMock.drawingColorInput = '#ffaaaa';
    component.onClose();
    expect(window.confirm).toHaveBeenCalled();
    expect(dialogRefMock.close).toHaveBeenCalled();
  });

  it('should not close if the user refuses the prompt', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    dataMock.drawingColorInput = '#ffaaaa';
    component.onClose();
    expect(window.confirm).toHaveBeenCalled();
    expect(dialogRefMock.close).not.toHaveBeenCalled();
  });

  it('should assign default values to canvas parameters if inputs are empty', () => {
    component.reinitializeDrawingVariables();
    component.onAcceptClick();
    expect(dataMock.drawingColor).toBe('#ffffff');
    expect(dataMock.drawingHeight).toBe(window.innerHeight - AppConstants.TITLEBAR_WIDTH);
    expect(dataMock.drawingWidth).toBe(window.innerWidth - AppConstants.SIDEBAR_WIDTH);
  });

  it('should properly pass user input to canvas parameters', () => {
    dataMock.drawingColorInput = '#ffaaaa';
    dataMock.drawingHeightInput = NEW_WINDOW_SIZE;
    dataMock.drawingWidthInput = NEW_WINDOW_SIZE;
    component.onAcceptClick();
    expect(dataMock.drawingColor).toBe(dataMock.drawingColorInput);
    expect(dataMock.drawingHeight).toBe(dataMock.drawingHeightInput);
    expect(dataMock.drawingWidth).toBe(dataMock.drawingWidthInput);
  });

  it('should update the resize preview if user inputs are not present', () => {
    component.reinitializeDrawingVariables();
    innerHeight = NEW_WINDOW_SIZE;
    innerWidth = NEW_WINDOW_SIZE;
    window.dispatchEvent(new Event('resize'));
    component.updateWindowSize();
    expect(dataMock.drawingWidthPreview).toBe(NEW_WINDOW_SIZE - AppConstants.SIDEBAR_WIDTH);
    expect(dataMock.drawingHeightPreview).toBe(NEW_WINDOW_SIZE - AppConstants.TITLEBAR_WIDTH);
  });

  it('should not update resize width preview if user input for height is present', () => {
    const originalWidth = window.innerWidth;
    window.dispatchEvent(new Event('resize'));
    dataMock.drawingHeightInput = MOCK_USER_INPUT;
    innerWidth = NEW_WINDOW_SIZE;
    window.dispatchEvent(new Event('resize'));
    component.updateWindowSize();
    component.onAcceptClick();
    expect(dataMock.drawingWidth).toBe(originalWidth - AppConstants.SIDEBAR_WIDTH);
    expect(dataMock.drawingHeight).toBe(MOCK_USER_INPUT);
  });

  it('should not update resize height preview if user input for width is present', () => {
    const originalHeight = window.innerHeight;
    window.dispatchEvent(new Event('resize'));
    dataMock.drawingWidthInput = MOCK_USER_INPUT;
    innerHeight = NEW_WINDOW_SIZE;
    window.dispatchEvent(new Event('resize'));
    component.updateWindowSize();
    component.onAcceptClick();
    expect(dataMock.drawingHeight).toBe(originalHeight - AppConstants.TITLEBAR_WIDTH);
    expect(dataMock.drawingWidth).toBe(MOCK_USER_INPUT);
  });

  it('should call onClose when escape is pressed', () => {
    const spy = spyOn(component, 'onClose');
    const event = new KeyboardEvent('keypress', {
      key: 'Escape',
    });
    dispatchEvent(event);
    component.onKeydownHandler(event);
    expect(spy).toHaveBeenCalled();
  });

});
