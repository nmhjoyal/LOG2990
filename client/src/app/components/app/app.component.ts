import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { ModalWindowComponent } from 'src/app/drawing-view/components/modal-window/modal-window.component';
import { NewDrawingWindowComponent } from 'src/app/drawing-view/components/new-drawing-window/new-drawing-window.component';
import { NewDrawingModalData } from 'src/app/drawing-view/components/NewDrawingModalData';
import { WelcomeWindowComponent } from 'src/app/drawing-view/components/welcome-window/welcome-window.component';
import { LocalStorageService } from 'src/app/services/local_storage/LocalStorageService';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
import { AppConstants } from 'src/AppConstants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  @HostListener('document:keydown.control.o', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    event.preventDefault();
    this.confirmNewDrawing();
  }

  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<ModalWindowComponent>,
              private storage: LocalStorageService, public toolHandler: ToolHandlerService, @Inject(MAT_DIALOG_DATA) public data: NewDrawingModalData) {
    this.data.drawingHeight = window.innerHeight - AppConstants.TITLEBAR_WIDTH;
    this.data.drawingWidth = window.innerWidth - AppConstants.SIDEBAR_WIDTH;
    this.data.drawingColor = '#ffffff';
    this.data.canvasIsDrawnOn = true;
  }

  confirmNewDrawing(): void {
    if (!this.dialog.openDialogs.length) {
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

  ngOnInit(): void {
    this.openWelcomeScreen();
  }

  openWelcomeScreen(): void {
    const showAgain = this.storage.getShowAgain();
    if (showAgain) {
      this.dialog.open(WelcomeWindowComponent, {
        data: { storage: this.storage },
        disableClose: true,
      });
    }
  }

}
