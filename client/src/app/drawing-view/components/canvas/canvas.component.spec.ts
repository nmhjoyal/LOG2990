import SpyObj = jasmine.SpyObj;

import { HttpClientModule } from '@angular/common/http';
import { Type } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatCheckboxModule, MatDialogConfig, MatDialogRef,
  MatListModule, MatSidenavModule, MatToolbarModule } from '@angular/material';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from 'src/app/components/app/app.component';
import { ColorService } from 'src/app/services/color_service/color.service';
import { LocalStorageService } from 'src/app/services/local_storage/local-storage-service';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
import { AppConstants } from 'src/AppConstants';
import { DrawingViewModule } from '../../drawing-view.module';
import { ColorPaletteComponent } from '../color-picker/color-palette/color-palette.component';
import { ColorPickerComponent } from '../color-picker/color-picker.component';
import { ModalWindowComponent } from '../modal-window/modal-window.component';
import { INewDrawingModalData } from '../new-drawing-window/INewDrawingModalData';
import { NewDrawingWindowComponent } from '../new-drawing-window/new-drawing-window.component';
import { IShape } from '../tools/assets/interfaces/shape-interface';
import { Id } from '../tools/assets/tool-constants';
import { WelcomeWindowComponent } from '../welcome-window/welcome-window.component';
import { CanvasComponent } from './canvas.component';

describe('CanvasComponent', () => {
  let dataMock: SpyObj<INewDrawingModalData>;
  const mockColourService: ColorService = new ColorService();
  const mockToolService: ToolHandlerService = new ToolHandlerService(mockColourService);
  let component: CanvasComponent;
  let fixture: ComponentFixture<CanvasComponent>;
  const testObject: IShape = { x: 1,
    y: 1,
    width: 1,
    height: 1,
    primaryColor: AppConstants.DEFAULT_PRIMARY_COLOUR,
    secondaryColor: AppConstants.DEFAULT_SECONDARY_COLOUR,
    strokeOpacity: 1,
    strokeWidth: 1,
    fillOpacity: 1,
    id: Id.RECTANGLE, };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatListModule,
        MatToolbarModule,
        MatCheckboxModule,
        MatSidenavModule,
        FormsModule,
        DrawingViewModule,
        BrowserDynamicTestingModule,
        BrowserAnimationsModule,
        HttpClientModule,
      ],
      declarations: [
        AppComponent,
        NewDrawingWindowComponent,
        WelcomeWindowComponent,
        ModalWindowComponent as Type<ModalWindowComponent>,
        ColorPaletteComponent,
        ColorPickerComponent,
      ],
      providers: [  MatDialogConfig, LocalStorageService,
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: [dataMock] },
        { provide: ToolHandlerService, useValue: mockToolService },
        { provide: ColorService, useValue: mockColourService },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(CanvasComponent);
    component = fixture.componentInstance;
  }));

  beforeEach(async(() => {
    dataMock = jasmine.createSpyObj('NewDrawingModalData', ['']);
  }));

  it('should properly create the component', () => {
    expect(component).toBeDefined();
  });

  it('should apply primary color', () => {
    mockColourService.color[0] = AppConstants.DEFAULT_SECONDARY_COLOUR;
    mockToolService.colourApplicatorSelected = true;
    component.applyColourToShape(testObject);
    expect(testObject.primaryColor).toEqual(AppConstants.DEFAULT_SECONDARY_COLOUR);
  });

  it('should apply secondary color', () => {
    mockColourService.color[1] = AppConstants.DEFAULT_PRIMARY_COLOUR;
    mockToolService.colourApplicatorSelected = true;
    component.applySecondaryColourToShape(new MouseEvent('contextmenu'), testObject);
    expect(testObject.secondaryColor).toEqual(AppConstants.DEFAULT_PRIMARY_COLOUR);
  });

});
