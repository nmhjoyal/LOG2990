import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { INewDrawingModalData } from 'src/app/drawing-view/components/new-drawing-window/INewDrawingModalData';
import { NewDrawingWindowComponent } from 'src/app/drawing-view/components/new-drawing-window/new-drawing-window.component';
import { WelcomeWindowComponent } from 'src/app/drawing-view/components/welcome-window/welcome-window.component';
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
              @Inject(MAT_DIALOG_DATA) private data: INewDrawingModalData) {
    this.data.drawingHeight = window.innerHeight - NumericalValues.TITLEBAR_WIDTH;
    this.data.drawingWidth = window.innerWidth - NumericalValues.SIDEBAR_WIDTH;
    this.data.drawingColor = Strings.WHITE_HEX;
  }

  ngOnInit(): void {
    this.openWelcomeScreen();
  }

  @HostListener('document:keydown.control.o', ['$event']) onKeydownHandler(event: KeyboardEvent): void {
    event.preventDefault();
    this.confirmNewDrawing();
  }

  @HostListener('document:keydown.1', ['$event']) onKeydown1(event: KeyboardEvent) {
    event.preventDefault();
    if (!this.dialog.openDialogs.length) {
      this.toolHandler.chooseRectangle();
    }
  }

  confirmNewDrawing(): void {
    if (!this.dialog.openDialogs.length) {
      if (this.toolHandler.drawings.length) {
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
