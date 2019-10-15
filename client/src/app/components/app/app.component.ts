import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { INewDrawingModalData } from 'src/app/drawing-view/components/modal-windows/new-drawing-window/INewDrawingModalData';
import { NewDrawingWindowComponent } from 'src/app/drawing-view/components/modal-windows/new-drawing-window/new-drawing-window.component';
import { SaveWindowComponent } from 'src/app/drawing-view/components/modal-windows/save-window/save-window.component';
import { WelcomeWindowComponent } from 'src/app/drawing-view/components/modal-windows/welcome-window/welcome-window.component';
import { LocalStorageService } from 'src/app/services/local_storage/local-storage-service';
import { NumericalValues } from 'src/AppConstants/NumericalValues';
import { Strings } from 'src/AppConstants/Strings';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  constructor(private dialog: MatDialog, private storage: LocalStorageService,
    @Inject(MAT_DIALOG_DATA) private data: INewDrawingModalData) {
    this.data.drawingHeight = window.innerHeight - NumericalValues.TITLEBAR_WIDTH;
    this.data.drawingWidth = window.innerWidth - NumericalValues.SIDEBAR_WIDTH;
    this.data.drawingColor = Strings.WHITE_HEX;
    this.data.canvasIsDrawnOn = true;
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

  confirmNewDrawing(): void {
    if (this.isOnlyModalOpen()) {
      if (!this.data.canvasIsDrawnOn) {
        this.openNewDrawingDialog();
      } else if (confirm('Si vous continuez, vous perdrez vos changements. Êtes-vous sûr.e?')) {
        this.openNewDrawingDialog();
      }
    }
  }

  openNewDrawingDialog(): void {
    this.dialog.open(NewDrawingWindowComponent, {
      data: NewDrawingWindowComponent.prototype.data,
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
        data: SaveWindowComponent.prototype.data,
        panelClass: 'save-window',
      });
    }
  }

  isOnlyModalOpen(): boolean {
    return !this.dialog.openDialogs.length;
  }

}
