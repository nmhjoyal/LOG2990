import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
// tslint:disable-next-line: max-line-length
import { GalleryWindowComponent } from 'src/app/drawing-view/components/modal-windows/gallery-window/gallery-window/gallery-window.component';
import { INewDrawingModalData } from 'src/app/drawing-view/components/modal-windows/new-drawing-window/INewDrawingModalData';
import { NewDrawingWindowComponent } from 'src/app/drawing-view/components/modal-windows/new-drawing-window/new-drawing-window.component';
import { SaveWindowComponent } from 'src/app/drawing-view/components/modal-windows/save-window/save-window.component';
import { WelcomeWindowComponent } from 'src/app/drawing-view/components/modal-windows/welcome-window/welcome-window.component';
import { CanvasInformationService } from 'src/app/services/canvas-information/canvas-information.service';
import { LocalStorageService } from 'src/app/services/local_storage/local-storage-service';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
import { NumericalValues } from 'src/AppConstants/NumericalValues';
import { Strings } from 'src/AppConstants/Strings';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  constructor(private dialog: MatDialog, private storage: LocalStorageService, protected toolHandler: ToolHandlerService,
    @Inject(MAT_DIALOG_DATA) private data: INewDrawingModalData, public canvasData: CanvasInformationService) {
    this.canvasData.data = {
      drawingHeight: window.innerHeight - NumericalValues.TITLEBAR_WIDTH,
      drawingWidth: window.innerWidth - NumericalValues.SIDEBAR_WIDTH,
      drawingColor: Strings.WHITE_HEX,
    };
  }

  ngOnInit(): void {
    this.openWelcomeScreen();
    this.openSaveWindow();
  }

  @HostListener('document:keydown.control.o', ['$event']) onKeydownHandlerCtrlO(event: KeyboardEvent): void {
    event.preventDefault();
    this.confirmNewDrawing();
  }

  @HostListener('document:keydown.control.s', ['$event']) onKeydownHandlerCtrlS(event: KeyboardEvent): void {
    event.preventDefault();
    this.openSaveWindow();
  }

  @HostListener('document:keydown.control.g', ['$event']) onKeydownHandlerCtrlG(event: KeyboardEvent): void {
    event.preventDefault();
    this.openGalleryWindow();
  }


  @HostListener('document:keydown.1', ['$event']) onKeydown1(event: KeyboardEvent) {
    event.preventDefault();
    if (!this.dialog.openDialogs.length) {
      this.toolHandler.chooseRectangle();
    }
  }
  confirmNewDrawing(): void {
    if (this.isOnlyModalOpen()) {
      if (!this.toolHandler.drawings.length) {
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

}
