import SpyObj = jasmine.SpyObj;

import { HttpClientModule } from '@angular/common/http';
import { Type } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatCheckboxModule, MatDialogConfig, MatDialogRef, MatIconModule,
  MatListModule, MatMenuModule, MatSelectModule, MatSidenavModule, MatToolbarModule } from '@angular/material';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from 'src/app/components/app/app.component';
import { ColorService } from 'src/app/services/color_service/color.service';
import { LocalStorageService } from 'src/app/services/local_storage/local-storage-service';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
import { Strings } from 'src/AppConstants/Strings';
import { DrawingViewModule } from '../../drawing-view.module';
import { ColorPaletteComponent } from '../color-picker/color-palette/color-palette.component';
import { ColorPickerComponent } from '../color-picker/color-picker.component';
import { ModalWindowComponent } from '../modal-windows/modal-window/modal-window.component';
import { INewDrawingModalData } from '../modal-windows/new-drawing-window/INewDrawingModalData';
import { NewDrawingWindowComponent } from '../modal-windows/new-drawing-window/new-drawing-window.component';
import { WelcomeWindowComponent } from '../modal-windows/welcome-window/welcome-window.component';
import { IDrawingTool } from '../tools/assets/interfaces/drawing-tool-interface';
import { IShape } from '../tools/assets/interfaces/shape-interface';
import { Id, ToolConstants } from '../tools/assets/tool-constants';
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
    primaryColor: Strings.BLACK_HEX,
    secondaryColor: Strings.WHITE_HEX,
    strokeOpacity: 1,
    strokeWidth: 1,
    fillOpacity: 1,
    id: Id.RECTANGLE,
  };

  const testLine: IDrawingTool = {
      color: Strings.BLACK_HEX,
      points: '',
      strokeWidth: 0,
      strokeLinecap: '',
      strokeLinejoin: '',
      fill: '',
      filter: '',
      id: Id.CRAYON,
      x: 0,
      y: 0,
      width: 0,
      height: 0,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        MatListModule,
        MatToolbarModule,
        MatCheckboxModule,
        MatSidenavModule,
        MatMenuModule,
        MatIconModule,
        MatSelectModule,
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
    dataMock = jasmine.createSpyObj('NewDrawingModalData', ['']);
  });

  it('should properly create the component', () => {
    expect(component).toBeDefined();
  });

  it('should apply primary color to line', () => {
    mockColourService.color[ToolConstants.PRIMARY_COLOUR_INDEX] = Strings.WHITE_HEX;
    mockToolService.colourApplicatorSelected = true;
    component.applyColourToLine(testLine);
    expect(testLine.color).toEqual(Strings.WHITE_HEX);
  });

  it('should apply primary color to shape', () => {
    mockColourService.color[ToolConstants.PRIMARY_COLOUR_INDEX] = Strings.WHITE_HEX;
    mockToolService.colourApplicatorSelected = true;
    component.applyColourToShape(new MouseEvent('contextmenu'), testObject);
    expect(testObject.primaryColor).toEqual(Strings.WHITE_HEX);
  });

  it('should apply secondary color to shape', () => {
    mockColourService.color[ToolConstants.SECONDARY_COLOUR_INDEX] = Strings.BLACK_HEX;
    mockToolService.colourApplicatorSelected = true;
    component.applySecondaryColourToShape(new MouseEvent('contextmenu'), testObject);
    expect(testObject.secondaryColor).toEqual(Strings.BLACK_HEX);
  });

  it('should apply primary color from line', () => {
    testLine.color = Strings.WHITE_HEX;
    mockToolService.pipetteSelected = true;
    component.applyColourToLine(testLine);
    expect(mockColourService.color[ToolConstants.PRIMARY_COLOUR_INDEX]).toEqual(Strings.WHITE_HEX);
  });

  it('should apply secondary color from line', () => {
    testLine.color = Strings.WHITE_HEX;
    mockToolService.pipetteSelected = true;
    component.getColorFromLine(new MouseEvent('contextmenu'), testLine);
    expect(mockColourService.color[ToolConstants.SECONDARY_COLOUR_INDEX]).toEqual(Strings.WHITE_HEX);
  });

  it('should apply primary color from shape', () => {
    testObject.secondaryColor = Strings.WHITE_HEX;
    mockToolService.pipetteSelected = true;
    component.getColorFromShape(new MouseEvent('click'), ToolConstants.PRIMARY_COLOUR_INDEX, testObject);
    expect(mockColourService.color[ToolConstants.PRIMARY_COLOUR_INDEX]).toEqual(Strings.WHITE_HEX);
  });

  it('should apply secondary color from shape', () => {
    testObject.secondaryColor = Strings.WHITE_HEX;
    mockToolService.pipetteSelected = true;
    component.getColorFromShape(new MouseEvent('contextmenu'), ToolConstants.SECONDARY_COLOUR_INDEX, testObject);
    expect(mockColourService.color[ToolConstants.SECONDARY_COLOUR_INDEX]).toEqual(Strings.WHITE_HEX);
  });

});
