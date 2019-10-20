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
import { DrawingViewModule } from '../../drawing-view.module';
import { ColorPaletteComponent } from '../color-picker/color-palette/color-palette.component';
import { ColorPickerComponent } from '../color-picker/color-picker.component';
import { IDrawingTool } from '../tools/assets/interfaces/drawing-tool-interface';
import { IShape } from '../tools/assets/interfaces/shape-interface';
import { Id, ToolConstants } from '../tools/assets/tool-constants';
import { CanvasComponent } from './canvas.component';
import { INewDrawingModalData } from '../modal-windows/new-drawing-window/INewDrawingModalData';
import { NewDrawingWindowComponent } from '../modal-windows/new-drawing-window/new-drawing-window.component';
import { WelcomeWindowComponent } from '../modal-windows/welcome-window/welcome-window.component';
import { ModalWindowComponent } from '../modal-windows/modal-window/modal-window.component';
import { Strings } from 'src/AppConstants/Strings';

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
    primaryColor: Strings.WHITE_HEX,
    secondaryColor: Strings.BLACK_HEX,
    strokeOpacity: 1,
    strokeWidth: 1,
    fillOpacity: 1,
    id: Id.RECTANGLE, };

  const testLine: IDrawingTool = {
      color: Strings.WHITE_HEX,
      points: '',
      strokeWidth: 0,
      strokeLinecap: '',
      strokeLinejoin: '',
      fill: '',
      filter: '',
      id: Id.CRAYON, };

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

  it('should apply primary color to line', () => {
    mockColourService.color[ToolConstants.PRIMARY_COLOUR_INDEX] = Strings.BLACK_HEX;
    mockToolService.colourApplicatorSelected = true;
    component.applyColourToLine(testLine);
    expect(testLine.color).toEqual(Strings.BLACK_HEX);
  });

  it('should apply primary color to shape', () => {
    mockColourService.color[0] =Strings.BLACK_HEX;
    mockToolService.colourApplicatorSelected = true;
    component.applyColourToShape(testObject);
    expect(testObject.primaryColor).toEqual(Strings.BLACK_HEX);
  });

  it('should apply secondary color to shape', () => {
    mockColourService.color[1] = Strings.WHITE_HEX;
    mockToolService.colourApplicatorSelected = true;
    component.applySecondaryColourToShape(new MouseEvent('contextmenu'), testObject);
    expect(testObject.secondaryColor).toEqual(Strings.WHITE_HEX);
  });

});
