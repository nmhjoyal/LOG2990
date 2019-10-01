import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { ColorPickerComponent } from '../../drawing-view/components/color-picker/color-picker.component';
import { NewDrawingModalData } from 'src/app/drawing-view/components/NewDrawingModalData';
import { NewDrawingWindowComponent } from 'src/app/drawing-view/components/new-drawing-window/new-drawing-window.component';
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
    if (!this.dialog.openDialogs.length) {
      if (!this.data.canvasIsDrawnOn) {
        this.openNewDrawingDialog();
      } else if (confirm('Si vous continuez, vous perdrez vos changements. Êtes-vous sûr.e?')) {
          this.openNewDrawingDialog();
      }
    }
  }

  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<NewDrawingWindowComponent>,
              private storage: LocalStorageService,  @Inject(MAT_DIALOG_DATA) public data: NewDrawingModalData) {
    this.data.drawingHeight = window.innerHeight - AppConstants.TITLEBAR_WIDTH;
    this.data.drawingWidth = window.innerWidth - AppConstants.SIDEBAR_WIDTH;
    this.data.drawingColor = '#ffffff';
    this.data.canvasIsDrawnOn = true;
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

  openChooseColorgDialog(): void {
    this.dialog.open(ColorPickerComponent, {
      data: ColorPickerComponent.prototype.data,
      panelClass: 'choose-color-window',
    });
  }

}
