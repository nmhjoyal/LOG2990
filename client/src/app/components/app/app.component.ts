import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { NewDrawingWindowComponent } from 'src/app/drawing-view/components/new-drawing-window/new-drawing-window.component';
import { NewDrawingModalData } from 'src/app/drawing-view/components/NewDrawingModalData';
import { WelcomeWindowComponent } from 'src/app/drawing-view/components/welcome-window/welcome-window.component';
import { LocalStorageService } from 'src/app/services/local_storage/LocalStorageService';
import { AppConstants } from 'src/AppConstants';
import { MygridService } from '../../services/mygrid/mygrid.service';
//import { CanvasComponent } from 'src/app/drawing-view/components/canvas/canvas.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  constructor(private dialog: MatDialog, private storage: LocalStorageService, @Inject(MAT_DIALOG_DATA) private data: NewDrawingModalData, private mygridsvc: MygridService) {
    this.data.drawingHeight = window.innerHeight - AppConstants.TITLEBAR_WIDTH;
    this.data.drawingWidth = window.innerWidth - AppConstants.SIDEBAR_WIDTH;
    this.data.drawingColor = AppConstants.WHITE_HEX;
    this.data.canvasIsDrawnOn = true;
  }

  ngOnInit(): void {
    this.openWelcomeScreen();
  }

  @HostListener('document:keydown.control.o', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    event.preventDefault();
    this.confirmNewDrawing();
  }

  confirmNewDrawing(): void {
    if (!this.dialog.openDialogs.length) {
      if (!this.data.canvasIsDrawnOn) {
        this.openNewDrawingDialog();
      } else if (confirm('Si vous continuez, vous perdrez vos changements. Êtes-vous sûr(e)?')) {
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
    const showAgain = this.storage.getShowAgain();
    if (showAgain) {
      this.dialog.open(WelcomeWindowComponent, {
        data: { storage: this.storage },
        disableClose: true,
      });
    }
  }

  toggleGrid(): void {
    this.mygridsvc.toggleGrid();
  }

  setOpacity(): void {
    let stringValue = (document.getElementById('opacitySlider') as HTMLInputElement).value;
    let numberValue = Number(stringValue)/100;      // Car 'slider' va de 0 à 100.
    this.mygridsvc.setOpacity(numberValue);
    console.log("value:" + numberValue);
  }

  setSize(): void {
    let stringValue = (document.getElementById('sizeSlider') as HTMLInputElement).value;
    let numberValue = Number(stringValue);
    this.mygridsvc.setSize(numberValue);
    console.log("value:" + numberValue);

  }
  
}
