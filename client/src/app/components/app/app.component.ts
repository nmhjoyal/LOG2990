import { Component, ElementRef, HostListener, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatSidenav } from '@angular/material';
import { CanvasComponent } from 'src/app/drawing-view/components/canvas/canvas.component';
import { ExportWindowComponent } from 'src/app/drawing-view/components/modal-windows/export-window/export-window.component';
// tslint:disable-next-line: max-line-length
import { GalleryWindowComponent } from 'src/app/drawing-view/components/modal-windows/gallery-window/gallery-window/gallery-window.component';
import { INewDrawingModalData } from 'src/app/drawing-view/components/modal-windows/new-drawing-window/INewDrawingModalData';
import { NewDrawingWindowComponent } from 'src/app/drawing-view/components/modal-windows/new-drawing-window/new-drawing-window.component';
import { SaveWindowComponent } from 'src/app/drawing-view/components/modal-windows/save-window/save-window.component';
import { WelcomeWindowComponent } from 'src/app/drawing-view/components/modal-windows/welcome-window/welcome-window.component';
import ClickHelper from 'src/app/helpers/click-helper/click-helper';
import { CanvasInformationService } from 'src/app/services/canvas-information/canvas-information.service';
import { ClipboardService } from 'src/app/services/clipboard/clipboard-service';
import { ColourService } from 'src/app/services/colour_service/colour.service';
import { DragService } from 'src/app/services/drag/drag.service';
import { DrawingStorageService } from 'src/app/services/drawing-storage/drawing-storage.service';
import { ExportInformationService } from 'src/app/services/export-information/export-information.service';
import { LocalStorageService } from 'src/app/services/local_storage/local-storage-service';
import { SelectorService } from 'src/app/services/selector-service/selector-service';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
import { ControlPoints } from 'src/AppConstants/ControlPoints';
import { NumericalValues } from 'src/AppConstants/NumericalValues';
import { Strings } from 'src/AppConstants/Strings';
import { ColourPickerComponent } from '../../drawing-view/components/modal-windows/colour-window/colour-picker/colour-picker.component';
import { GridService } from '../../services/grid/grid.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  protected cursorX: number;
  protected cursorY: number;
  controlPoint: ControlPoints;

  @ViewChild('toggle', { static: false }) toggle: ElementRef<HTMLElement>;
  @ViewChild('snapToggle', { static: false }) snapToggle: ElementRef<HTMLElement>;
  @ViewChild('options', { static: false }) optionsSidebar: MatSidenav;
  @ViewChild('canvas', { static: false, read: ElementRef }) canvasElement: ElementRef<CanvasComponent>;

  constructor(private dialog: MatDialog,
    private storage: LocalStorageService,
    protected toolHandler: ToolHandlerService,
    protected drawingStorage: DrawingStorageService,
    @Inject(MAT_DIALOG_DATA) protected data: INewDrawingModalData,
    public canvasData: CanvasInformationService,
    public colourService: ColourService,
    public exportData: ExportInformationService,
    private gridService: GridService,
    public clipboardService: ClipboardService,
    public selectorService: SelectorService,
    public dragService: DragService) {
    this.canvasData.data = {
      drawingHeight: window.innerHeight - NumericalValues.TITLEBAR_WIDTH,
      drawingWidth: window.innerWidth - NumericalValues.SIDEBAR_WIDTH,
      drawingColour: Strings.WHITE_HEX,
    };
    this.cursorX = 0;
    this.cursorY = 0;
  }

  ngOnInit(): void {
    this.openWelcomeScreen();
    this.selectorService.controlPoint = this.controlPoint;
  }

  @HostListener('mousemove', ['$event']) onMouseMove(event: MouseEvent): void {
    this.cursorX = ClickHelper.getXPosition(event);
    this.cursorY = ClickHelper.getYPosition(event);
  }

  @HostListener('document:keydown.c', ['$event']) onKeydownC(): void {
    if (this.isOnlyModalOpen()  && !this.toolHandler.isUsingText()) {
      this.toolHandler.chooseCrayon();
    }
  }

  @HostListener('document:keydown.w', ['$event']) onKeydownW(): void {
    if (this.isOnlyModalOpen()  && !this.toolHandler.isUsingText()) {
      this.toolHandler.choosePaintbrush();
    }
  }

  @HostListener('document:keydown.b', ['$event']) onKeydownB(): void {
    if (this.isOnlyModalOpen()  && !this.toolHandler.isUsingText()) {
      this.toolHandler.chooseBucket();
    }
  }

  @HostListener('document:keydown.i', ['$event']) onKeydownI(): void {
    if (this.isOnlyModalOpen()  && !this.toolHandler.isUsingText()) {
      this.toolHandler.chooseEyedropper();
    }
  }

  @HostListener('document:keydown.r', ['$event']) onKeydownR(): void {
    if (this.isOnlyModalOpen() &&  !this.toolHandler.isUsingText()) {
      this.toolHandler.chooseColourApplicator();
    }
  }

  @HostListener('document:keydown.s', ['$event']) onKeydownS(): void {
    if (this.isOnlyModalOpen()  && !this.toolHandler.isUsingText()) {
      this.toolHandler.chooseSelector();
    }
  }

  @HostListener('document:keydown.control.z', ['$event']) onKeydownCtrlZ(): void {
    if (this.isOnlyModalOpen() ) {
      this.clipboardService.undo();
    }
  }

  @HostListener('document:keydown.control.shift.z', ['$event']) onKeydownCtrlShiftZ(): void {
    if (this.isOnlyModalOpen() ) {
      this.clipboardService.redo();
    }
  }

  @HostListener('document:keydown.control.c', ['$event']) onKeydownCtrlC(): void {
    if (this.isOnlyModalOpen()) {
      this.clipboardService.copy();
    }
  }

  @HostListener('document:keydown.control.v', ['$event']) onKeydownCtrlV(): void {
    if (this.isOnlyModalOpen()) {
      this.clipboardService.paste(this.cursorX, this.cursorY);
    }
  }

  @HostListener('document:keydown.control.x', ['$event']) onKeydownCtrlX(): void {
    if (this.isOnlyModalOpen()) {
      this.clipboardService.cut();
    }
  }

  @HostListener('document:keydown.control.d', ['$event']) onKeydownCtrlD(event: KeyboardEvent): void {
    event.preventDefault();
    if (this.isOnlyModalOpen()) {
      this.clipboardService.duplicate();
    }
  }

  @HostListener('document:keydown.backspace', ['$event']) onKeydownBackspace(): void {
    if (this.isOnlyModalOpen()) {
      this.clipboardService.delete();
    }
  }

  @HostListener('document:keydown.delete', ['$event']) onKeydownDelete(): void {
    if (this.isOnlyModalOpen()) {
      this.clipboardService.delete();
    }
  }

  @HostListener('document:keydown.t', ['$event']) onKeydownT(): void {
    if (this.isOnlyModalOpen()  && !this.toolHandler.isUsingText()) {
      this.toolHandler.chooseText();
    }
  }

  @HostListener('document:keydown.y', ['$event']) onKeydownY(): void {
    if (this.isOnlyModalOpen()  && !this.toolHandler.isUsingText()) {
      this.toolHandler.choosePen();
    }
  }

  @HostListener('document:keydown.e', ['$event']) onKeydownE(): void {
    if (this.isOnlyModalOpen()  && !this.toolHandler.isUsingText()) {
      this.toolHandler.chooseEraser();
    }
  }

  @HostListener('document:keydown.p', ['$event']) onKeydownP(): void {
    if (this.isOnlyModalOpen()  && !this.toolHandler.isUsingText()) {
      this.toolHandler.chooseQuill();
    }
  }

  @HostListener('document:keydown.control.o', ['$event']) onKeydownCtrlO(event: KeyboardEvent): void {
    event.preventDefault();
    if (this.isOnlyModalOpen() ) {
      this.confirmNewDrawing();
    }
  }

  @HostListener('document:keydown.control.s', ['$event']) onKeydownCtrlS(event: KeyboardEvent): void {
    event.preventDefault();
    if (this.isOnlyModalOpen() ) {
      this.openSaveWindow();
    }
  }

  @HostListener('document:keydown.control.e', ['$event']) onKeydownCtrlE(event: KeyboardEvent): void {
    event.preventDefault();
    if (this.isOnlyModalOpen() ) {
      this.openExportWindow();
    }
  }

  @HostListener('document:keydown.control.g', ['$event']) onKeydownCtrlG(event: KeyboardEvent): void {
    event.preventDefault();
    if (this.isOnlyModalOpen() ) {
      if (this.drawingStorage.isEmpty()) {
        this.openGalleryWindow();
      } else if (confirm('Si vous continuez, vous perdrez vos changements. Êtes-vous sûr.e?')) {
        this.openGalleryWindow();
      }
    }
  }

  @HostListener('document:keydown.1', ['$event']) onKeydown1(): void {
    if (this.isOnlyModalOpen()  && !this.toolHandler.isUsingText()) {
      this.toolHandler.chooseRectangle();
    }
  }

  @HostListener('document:keydown.2', ['$event']) onKeydown2(): void {
    if (this.isOnlyModalOpen()  && !this.toolHandler.isUsingText()) {
      this.toolHandler.chooseEllipse();
    }
  }

  @HostListener('document:keydown.3', ['$event']) onKeydown3(): void {
    if (this.isOnlyModalOpen()  && !this.toolHandler.isUsingText()) {
      this.toolHandler.choosePolygon();
    }
  }

  @HostListener('document:keydown.g', ['$event']) onKeydownG(): void {
    if (this.isOnlyModalOpen()  && !this.toolHandler.isUsingText()) {
      const toggle: HTMLElement = this.toggle.nativeElement;
      toggle.click();
    }
  }

  @HostListener('document:keydown.shift.+', ['$event']) onKeydownShiftPlus(): void {
    if (this.isOnlyModalOpen() ) {
      this.gridService.increaseSize();
    }
  }

  @HostListener('document:keydown.m', ['$event']) onKeydownM(): void {
    if (this.isOnlyModalOpen() && !this.optionsSidebar.opened) {
      const snapToggle: HTMLElement = this.snapToggle.nativeElement;
      snapToggle.click();
    }
  }

  @HostListener('document:keydown.+', ['$event']) onKeydownPlus(): void {
    if (this.isOnlyModalOpen() ) {
      this.gridService.increaseSize();
    }
  }

  @HostListener('document:keydown.-', ['$event']) onKeydownMinus(): void {
    if (this.isOnlyModalOpen() ) {
      this.gridService.decreaseSize();
    }
  }

  @HostListener('document:keydown.a', ['$event']) onKeydownA(): void {
    if (this.isOnlyModalOpen() &&  !this.toolHandler.isUsingText()) {
      this.toolHandler.chooseSprayCan();
    }
  }

  confirmNewDrawing(): void {
    if (this.isOnlyModalOpen()) {
      if (this.drawingStorage.isEmpty()) {
        this.openNewDrawingDialog();
      } else if (confirm('Si vous continuez, vous perdrez vos changements. Êtes-vous sûr.e?')) {
        this.openNewDrawingDialog();
      }
    }
  }

  openNewDrawingDialog(): void {
    this.dialog.open(NewDrawingWindowComponent, {
      data: {
        data: NewDrawingWindowComponent.prototype.data,
        canvasData: CanvasInformationService.prototype.data,
      },
      panelClass: 'new-drawing-window',
    });
  }

  openWelcomeScreen(): void {
    if (this.isOnlyModalOpen()) {
      const showAgain = this.storage.getShowAgain();
      if (showAgain) {
        this.dialog.open(WelcomeWindowComponent, {
          data: { storage: this.storage },
          disableClose: true,
        });
      }
    }
  }

  openSaveWindow(): void {
    if (this.isOnlyModalOpen()) {
      this.dialog.open(SaveWindowComponent, {
        data: {
          data: SaveWindowComponent.prototype.data,
          canvasData: CanvasInformationService.prototype.data,
        },
        panelClass: 'save-window',
      });
    }
  }

  openExportWindow(): void {
    if (this.isOnlyModalOpen()) {
      this.dialog.open(ExportWindowComponent, {
        panelClass: 'export-window',
      });
    }
  }

  openGalleryWindow(): void {
    if (this.isOnlyModalOpen()) {
      this.dialog.open(GalleryWindowComponent, {
        data: {
          data: GalleryWindowComponent.prototype.data,
          canvasData: CanvasInformationService.prototype.data,
        },
        panelClass: 'gallery-window',
      });
    }
  }

  isOnlyModalOpen(): boolean {
    return !this.dialog.openDialogs.length;
  }

  openChooseColourDialog(): void {
    this.dialog.open(ColourPickerComponent, {
      panelClass: 'choose-colour-window',
    });
  }

  onSelectionChange() {
    this.selectorService.controlPoint = this.controlPoint;
  }
}
