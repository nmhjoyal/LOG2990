import SpyObj = jasmine.SpyObj;
import { HttpClientModule } from '@angular/common/http';
import { ChangeDetectionStrategy } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatButtonModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ColorService } from 'src/app/services/color_service/color.service';
import { AppConstants } from 'src/AppConstants';
import { ColorPaletteComponent } from '../color-picker/color-palette/color-palette.component';
import { ModalWindowComponent } from '../modal-window/modal-window.component';
import { NewDrawingModalData } from '../NewDrawingModalData';
import { NewDrawingWindowComponent } from './new-drawing-window.component';

describe('NewDrawingWindowComponent', () => {
  let dataMock: SpyObj<NewDrawingModalData>;
  let colorService: ColorService;
  // let colorPalette: ColorPaletteComponent;
  let dialogRefMock: SpyObj<MatDialogRef<NewDrawingWindowComponent>>;
  let component: NewDrawingWindowComponent;
  let fixture: ComponentFixture<NewDrawingWindowComponent>;
  dataMock = jasmine.createSpyObj('NewDrawingModalData', ['']);

  const dialogMock = {
    close: () => {
      console.log('MockDialog close');
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
        ColorPaletteComponent,
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
    colorService = new ColorService();
    component = new NewDrawingWindowComponent(dialogRefMock, colorService, dataMock);
    // colorPalette = new ColorPaletteComponent(colorService);
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
    dataMock.drawingColorInput = '#ffaaaaff';
    component.onClose();
    expect(window.confirm).toHaveBeenCalled();
    expect(dialogRefMock.close).toHaveBeenCalled();
  });

  it('should not close if the user refuses the prompt', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    dataMock.drawingColorInput = '#ffaaaaff';
    component.onClose();
    expect(window.confirm).toHaveBeenCalled();
    expect(dialogRefMock.close).not.toHaveBeenCalled();
  });

  it('should assign default values to canvas parameters if inputs are empty', () => {
    component.reinitializeDrawingVariables();
    component.onAcceptClick();
    expect(dataMock.drawingColor).toBe('#ffffffff');
    expect(dataMock.drawingHeight).toBe(window.innerHeight - AppConstants.TITLEBAR_WIDTH);
    expect(dataMock.drawingWidth).toBe(window.innerWidth - AppConstants.SIDEBAR_WIDTH);
  });

  it('should properly pass user input to canvas parameters', () => {
    dataMock.drawingColorInput = '#ffaaaaff';
    dataMock.drawingHeightInput = 500;
    dataMock.drawingWidthInput = 200;
    component.onAcceptClick();
    expect(dataMock.drawingColor).toBe(dataMock.drawingColorInput);
    expect(dataMock.drawingHeight).toBe(dataMock.drawingHeightInput);
    expect(dataMock.drawingWidth).toBe(dataMock.drawingWidthInput);
  });

/* TODO: FIX
  it('should properly pass color input from palette to canvas parameters', () => {
    spyOn(colorPalette, 'getColorAtPosition').and.returnValue('#aaffaaff');
    spyOn(colorPalette.color1, 'emit').and.callThrough();
    colorPalette.color1.emit();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(dataMock.drawingColor).toEqual('#aaffaaff');
    });
  });
*/
  it('should update the resize preview if user inputs are not present', () => {
    component.reinitializeDrawingVariables();
    (window as any).innerHeight = 500;
    (window as any).innerWidth = 500;
    window.dispatchEvent(new Event('resize'));
    component.updateWindowSize();
    expect(dataMock.drawingWidthPreview).toBe(500 - AppConstants.SIDEBAR_WIDTH);
    expect(dataMock.drawingHeightPreview).toBe(500 - AppConstants.TITLEBAR_WIDTH);
  });

  it('should not update resize width preview if user input for height is present', () => {
    const originalWidth = window.innerWidth;
    window.dispatchEvent(new Event('resize'));
    dataMock.drawingHeightInput = 200;
    (window as any).innerWidth = 100;
    window.dispatchEvent(new Event('resize'));
    component.updateWindowSize();
    component.onAcceptClick();
    expect(dataMock.drawingWidth).toBe(originalWidth - AppConstants.SIDEBAR_WIDTH);
    expect(dataMock.drawingHeight).toBe(200);
  });

  it('should not update resize height preview if user input for width is present', () => {
    const originalHeight = window.innerHeight;
    window.dispatchEvent(new Event('resize'));
    dataMock.drawingWidthInput = 200;
    (window as any).innerHeight = 100;
    window.dispatchEvent(new Event('resize'));
    component.updateWindowSize();
    component.onAcceptClick();
    expect(dataMock.drawingHeight).toBe(originalHeight - AppConstants.TITLEBAR_WIDTH);
    expect(dataMock.drawingWidth).toBe(200);
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
