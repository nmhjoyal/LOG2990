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
import { ColourService } from 'src/app/services/colour_service/colour.service';
import { DrawingStorageService } from 'src/app/services/drawing-storage/drawing-storage.service';
import { LocalStorageService } from 'src/app/services/local_storage/local-storage-service';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
import { Strings } from 'src/AppConstants/Strings';
import { DrawingViewModule } from '../../drawing-view.module';
import { ColourPaletteComponent } from '../modal-windows/colour-window/colour-palette/colour-palette.component';
import { ColourPickerComponent } from '../modal-windows/colour-window/colour-picker/colour-picker.component';
import { ModalWindowComponent } from '../modal-windows/modal-window/modal-window.component';
import { INewDrawingModalData } from '../modal-windows/new-drawing-window/INewDrawingModalData';
import { NewDrawingWindowComponent } from '../modal-windows/new-drawing-window/new-drawing-window.component';
import { WelcomeWindowComponent } from '../modal-windows/welcome-window/welcome-window.component';
import { Id } from '../tools/assets/constants/tool-constants';
import { IDrawingTool } from '../tools/assets/interfaces/drawing-tool-interface';
import { IShape } from '../tools/assets/interfaces/shape-interface';
import { CanvasComponent } from './canvas.component';

describe('CanvasComponent', () => {
  let dataMock: SpyObj<INewDrawingModalData>;
  let mockColourService: ColourService;
  let mockToolService: ToolHandlerService;
  let component: CanvasComponent;
  let fixture: ComponentFixture<CanvasComponent>;
  const testObject: IShape = { x: 1,
    y: 1,
    width: 1,
    height: 1,
    primaryColour: Strings.BLACK_HEX,
    secondaryColour: Strings.WHITE_HEX,
    strokeOpacity: 1,
    strokeWidth: 1,
    fillOpacity: 1,
    id: Id.RECTANGLE,
  };

  const testLine: IDrawingTool = {
      colour: Strings.BLACK_HEX,
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
        ColourPaletteComponent,
        ColourPickerComponent,
      ],
      providers: [  MatDialogConfig,
        LocalStorageService,
        DrawingStorageService,
        ToolHandlerService,
        ColourService,
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: [dataMock] },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(CanvasComponent);
    component = fixture.componentInstance;
    mockColourService = TestBed.get(ColourService);
    mockToolService = TestBed.get(ToolHandlerService);
    dataMock = jasmine.createSpyObj('NewDrawingModalData', ['']);
  });

  it('should properly create the component', () => {
    expect(component).toBeDefined();
  });

  it('should apply primary colour to line', () => {
    mockColourService.colour[0] = Strings.WHITE_HEX;
    mockToolService.selectedTool = mockToolService.tools.COLOUR_APPLICATOR;
    component.applyColourToLine(testLine);
    expect(testLine.colour).toEqual(Strings.WHITE_HEX);
  });

  it('should apply primary colour to shape', () => {
    mockColourService.colour[0] = Strings.WHITE_HEX;
    mockToolService.selectedTool = mockToolService.tools.COLOUR_APPLICATOR;
    component.applyColourToShape(new MouseEvent('contextmenu'), testObject);
    expect(testObject.primaryColour).toEqual(Strings.WHITE_HEX);
  });

  it('should apply secondary colour to shape', () => {
    mockColourService.colour[1] = Strings.BLACK_HEX;
    mockToolService.selectedTool = mockToolService.tools.COLOUR_APPLICATOR;
    component.applySecondaryColourToShape(new MouseEvent('contextmenu'), testObject);
    expect(testObject.secondaryColour).toEqual(Strings.BLACK_HEX);
  });

  it('should apply primary colour from line', () => {
    testLine.colour = Strings.WHITE_HEX;
    mockToolService.selectedTool = mockToolService.tools.PIPETTE;
    component.applyColourToLine(testLine);
    expect(mockColourService.colour[0]).toEqual(Strings.WHITE_HEX);
  });

  it('should apply secondary colour from line', () => {
    testLine.colour = Strings.WHITE_HEX;
    mockToolService.selectedTool = mockToolService.tools.PIPETTE;
    component.getColourFromLine(new MouseEvent('contextmenu'), testLine);
    expect(mockColourService.colour[1]).toEqual(Strings.WHITE_HEX);
  });

  it('should apply primary colour from shape', () => {
    testObject.secondaryColour = Strings.WHITE_HEX;
    mockToolService.selectedTool = mockToolService.tools.PIPETTE;
    component.getColourFromShape(new MouseEvent('click'), 0, testObject);
    expect(mockColourService.colour[0]).toEqual(Strings.WHITE_HEX);
  });

  it('should apply secondary colour from shape', () => {
    testObject.secondaryColour = Strings.WHITE_HEX;
    mockToolService.selectedTool = mockToolService.tools.PIPETTE;
    component.getColourFromShape(new MouseEvent('contextmenu'), 1, testObject);
    expect(mockColourService.colour[1]).toEqual(Strings.WHITE_HEX);
  });

});
