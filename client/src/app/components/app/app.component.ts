import { Component, HostListener, Inject, OnInit, ViewChild} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatSidenav } from '@angular/material';
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
import { DrawingStorageService } from 'src/app/services/drawing-storage/drawing-storage.service';
import { LocalStorageService } from 'src/app/services/local_storage/local-storage-service';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
import { NumericalValues } from 'src/AppConstants/NumericalValues';
import { Strings } from 'src/AppConstants/Strings';
import { ColourPickerComponent } from '../../drawing-view/components/modal-windows/colour-window/colour-picker/colour-picker.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  protected cursorX: number;
  protected cursorY: number;

  @ViewChild('options', { static: false }) optionsSidebar: MatSidenav;

  constructor(private dialog: MatDialog,
    private storage: LocalStorageService,
    protected toolHandler: ToolHandlerService,
    protected drawingStorage: DrawingStorageService,
    @Inject(MAT_DIALOG_DATA) protected data: INewDrawingModalData,
    public canvasData: CanvasInformationService,
    public colourService: ColourService,
    public clipboardService: ClipboardService) {
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
  }

  @HostListener('mousemove', ['$event']) onMouseMove(event: MouseEvent): void {
    this.cursorX = ClickHelper.getXPosition(event);
    this.cursorY = ClickHelper.getYPosition(event);
  }

  @HostListener('document:keydown.c', ['$event']) onKeydownCEvent(): void {
    if (this.isOnlyModalOpen() && !this.optionsSidebar.opened && !this.toolHandler.isUsingText()) {
      this.toolHandler.chooseCrayon();
    }
  }

  @HostListener('document:keydown.w', ['$event']) onKeydownWEvent(): void {
    if (this.isOnlyModalOpen() && !this.optionsSidebar.opened && !this.toolHandler.isUsingText()) {
      this.toolHandler.choosePaintbrush();
    }
  }

  @HostListener('document:keydown.i', ['$event']) onKeydownIEvent(): void {
    if (!this.dialog.openDialogs.length && !this.optionsSidebar.opened && !this.toolHandler.isUsingText()) {
      this.toolHandler.chooseEyedropper();
    }
  }

  @HostListener('document:keydown.r', ['$event']) onKeydownREvent(): void {
    if (!this.dialog.openDialogs.length && !this.optionsSidebar.opened && !this.toolHandler.isUsingText()) {
      this.toolHandler.chooseColourApplicator(this.colourService.colour[0],
         this.colourService.colour[1], );
    }
  }

  @HostListener('document:keydown.s', ['$event']) onKeydownSEvent(): void {
    if (!this.dialog.openDialogs.length && !this.optionsSidebar.opened && !this.toolHandler.isUsingText()) {
      this.toolHandler.chooseSelector();
    }
  }

  @HostListener('document:keydown.control.c', ['$event']) onKeydownCtrlC(): void {
    if (!this.dialog.openDialogs.length) {
      this.clipboardService.copy();
    }
  }

  @HostListener('document:keydown.control.v', ['$event']) onKeydownCtrlV(): void {
    if (!this.dialog.openDialogs.length) {
      this.clipboardService.paste(this.cursorX, this.cursorY);
    }
  }

  @HostListener('document:keydown.control.x', ['$event']) onKeydownCtrlX(): void {
    if (!this.dialog.openDialogs.length) {
      this.clipboardService.cut();
    }
  }

  @HostListener('document:keydown.control.d', ['$event']) onKeydownCtrlD(event: KeyboardEvent): void {
    event.preventDefault();
    if (!this.dialog.openDialogs.length) {
      this.clipboardService.duplicate();
    }
  }

  @HostListener('document:keydown.backspace', ['$event']) onKeydownBackspace(): void {
    if (!this.dialog.openDialogs.length) {
      this.clipboardService.delete();
    }
  }

  @HostListener('document:keydown.t', ['$event']) onKeydownTEvent(): void {
    if (!this.dialog.openDialogs.length && !this.optionsSidebar.opened && !this.toolHandler.isUsingText()) {
      this.toolHandler.chooseText();
    }
  }

  @HostListener('document:keydown.control.o', ['$event']) onKeydownHandler(event: KeyboardEvent): void {
    event.preventDefault();
    if (this.isOnlyModalOpen() && !this.optionsSidebar.opened) {
      this.confirmNewDrawing();
    }
  }

  @HostListener('document:keydown.control.s', ['$event']) onKeydownHandlerCtrlS(event: KeyboardEvent): void {
    event.preventDefault();
    if (this.isOnlyModalOpen() && !this.optionsSidebar.opened) {
      this.openSaveWindow();
    }
  }

  @HostListener('document:keydown.control.g', ['$event']) onKeydownHandlerCtrlG(event: KeyboardEvent): void {
    event.preventDefault();
    if (this.isOnlyModalOpen() && !this.optionsSidebar.opened) {
      if (!this.drawingStorage.drawings.length) {
        this.openGalleryWindow();
      } else if (confirm('Si vous continuez, vous perdrez vos changements. Êtes-vous sûr.e?')) {
        this.openGalleryWindow();
      }
    }
  }

  @HostListener('document:keydown.1', ['$event']) onKeydown1(): void {
    if (this.isOnlyModalOpen() && !this.optionsSidebar.opened && !this.toolHandler.isUsingText()) {
      this.toolHandler.chooseRectangle();
    }
  }

  @HostListener('document:keydown.2', ['$event']) onKeydown2(): void {
    if (this.isOnlyModalOpen() && !this.optionsSidebar.opened && !this.toolHandler.isUsingText()) {
      this.toolHandler.chooseEllipse();
    }
  }

  @HostListener('document:keydown.3', ['$event']) onKeydown3(): void {
    if (this.isOnlyModalOpen() && !this.optionsSidebar.opened && !this.toolHandler.isUsingText()) {
      this.toolHandler.choosePolygon();
    }
  }

  confirmNewDrawing(): void {
    if (!this.dialog.openDialogs.length) {
      if (!this.drawingStorage.drawings.length) {
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

  switchColours(): void {
    this.colourService.switchColours();
    if (!(this.toolHandler.selectedTool === this.toolHandler.tools.COLOUR_APPLICATOR)) {
      this.toolHandler.resetToolSelection();
    }
  }
}
