import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { ModalWindowComponent } from 'src/app/drawing-view/components/modal-window/modal-window.component';
import { NewDrawingWindowComponent } from 'src/app/drawing-view/components/new-drawing-window/new-drawing-window.component';
import { ModalData } from 'src/app/drawing-view/components/NewDrawingModalData';
import { WelcomeWindowComponent } from 'src/app/drawing-view/components/welcome-window/welcome-window.component';
import { LocalStorageService } from 'src/app/services/local_storage/LocalStorageService';
import { AppConstants } from 'src/AppConstants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  @HostListener('document:keydown.control.o', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    event.preventDefault();
    if (!this.data.canvasIsDrawnOn) {
      if (this.dialog.openDialogs.length < 1) {
        this.openNewDrawingDialog();
      }
    } else {
        if (confirm('Si vous continuez, vous perdrez vos changements. Êtes-vous sûr.e?')) {
          this.openNewDrawingDialog();
        } else {
          return;
        }
    }
  }

  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<ModalWindowComponent>,
              private storage: LocalStorageService, @Inject(MAT_DIALOG_DATA) public data: ModalData) {
  }

  openNewDrawingDialog(): void {
    this.dialog.open(NewDrawingWindowComponent, {
      data: NewDrawingWindowComponent.prototype.data,
      panelClass: 'new-drawing-window',
    });
  }

  ngOnInit(): void {
    this.openWelcomeScreen();
    this.data.drawingHeight = window.innerHeight - AppConstants.TITLEBAR_WIDTH;
    this.data.drawingWidth = window.innerWidth - AppConstants.SIDEBAR_WIDTH;
    this.data.drawingColor = '#ffffff';
    this.data.canvasIsDrawnOn = true;
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
