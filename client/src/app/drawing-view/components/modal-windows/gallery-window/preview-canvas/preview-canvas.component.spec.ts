import SpyObj = jasmine.SpyObj;

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientModule } from '@angular/common/http';
import { Type } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MatCheckboxModule, MatIconModule, MatListModule, MatMenuModule,
  MatSelectModule, MatSidenavModule, MatToolbarModule
} from '@angular/material';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from 'src/app/components/app/app.component';
import { ColorPaletteComponent } from 'src/app/drawing-view/components/color-picker/color-palette/color-palette.component';
import { ColorPickerComponent } from 'src/app/drawing-view/components/color-picker/color-picker/color-picker.component';
import { DrawingViewModule } from 'src/app/drawing-view/drawing-view.module';
import { CanvasInformationService } from 'src/app/services/canvas-information/canvas-information.service';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
import { IDrawing } from '../../../../../../../../common/drawing-information/IDrawing';
import { ModalWindowComponent } from '../../modal-window/modal-window.component';
import { NewDrawingWindowComponent } from '../../new-drawing-window/new-drawing-window.component';
import { WelcomeWindowComponent } from '../../welcome-window/welcome-window.component';
import { PreviewCanvasComponent } from './preview-canvas.component';

describe('PreviewCanvasComponent', () => {

  let component: PreviewCanvasComponent;
  let fixture: ComponentFixture<PreviewCanvasComponent>;
  const canvasInformationMock: SpyObj<CanvasInformationService> = jasmine.createSpyObj('CanvasInformationService', ['']);
  const toolHandlerServiceMock: SpyObj<ToolHandlerService> = jasmine.createSpyObj('ToolHandlerService', ['clearPage']);

  const mockDrawing = {
    name: 'name',
    tags: [{ name: 'tag', isSelected: false }],
    timestamp: new Date().toLocaleString('en-GB', { timeZone: 'UTC' }),
    shapes: toolHandlerServiceMock.drawings,
    canvas: canvasInformationMock.data = { drawingHeight: 200, drawingColor: '#ffffffff', drawingWidth: 200 },
  } as IDrawing;

  beforeEach((() => {
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
    }).compileComponents();
    fixture = TestBed.createComponent(PreviewCanvasComponent);
    component = fixture.componentInstance;
    component.previewedDrawing = mockDrawing;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#ngOnInit should initialize viewBoxCoordinates', () => {
    component.ngOnInit();
    expect(component.viewboxCoordinates).not.toEqual('', 'viewBoxCoordinates were NOT initialized');
  });

});
