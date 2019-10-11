import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
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

  constructor(public dialog: MatDialog, private storage: LocalStorageService, public toolHandler: ToolHandlerService,
              @Inject(MAT_DIALOG_DATA) public data: NewDrawingModalData) {
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

  @HostListener('document:keydown.1', ['$event']) onKeydown1(event: KeyboardEvent) {
    event.preventDefault();
    this.toolHandler.chooseRectangle();
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
