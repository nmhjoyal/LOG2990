import { Component, HostListener, Inject, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog} from '@angular/material';
import { INewDrawingModalData } from 'src/app/drawing-view/components/new-drawing-window/INewDrawingModalData';
import { NewDrawingWindowComponent } from 'src/app/drawing-view/components/new-drawing-window/new-drawing-window.component';
import { ToolConstants } from 'src/app/drawing-view/components/tools/assets/tool-constants';
import { WelcomeWindowComponent } from 'src/app/drawing-view/components/welcome-window/welcome-window.component';
import { ColorService } from 'src/app/services/color_service/color.service';
import { LocalStorageService } from 'src/app/services/local_storage/local-storage-service';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
import { NumericalValues } from 'src/AppConstants/NumericalValues';
import { Strings } from 'src/AppConstants/Strings';
import { ColorPickerComponent } from '../../drawing-view/components/color-picker/color-picker.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  constructor(private dialog: MatDialog, private storage: LocalStorageService, public colorService: ColorService,
              protected toolHandler: ToolHandlerService,
              @Inject(MAT_DIALOG_DATA) private data: INewDrawingModalData) {
    this.data.drawingHeight = window.innerHeight - NumericalValues.TITLEBAR_WIDTH;
    this.data.drawingWidth = window.innerWidth - NumericalValues.SIDEBAR_WIDTH;
    this.data.drawingColor = Strings.WHITE_HEX;
  }

  @HostListener('document:keydown.c', ['$event']) onKeydownCEvent(): void {
    if (!this.dialog.openDialogs.length) {
      this.toolHandler.chooseCrayon();
    }
  }

  @HostListener('document:keydown.w', ['$event']) onKeydownWEvent(): void {
    if (!this.dialog.openDialogs.length) {
      this.toolHandler.choosePaintbrush();
    }
  }

  @HostListener('document:keydown.i', ['$event']) onKeydownIEvent(): void {
    if (!this.dialog.openDialogs.length) {
      this.toolHandler.chooseEyedropper();
    }
  }

  @HostListener('document:keydown.r', ['$event']) onKeydownREvent(): void {
    if (!this.dialog.openDialogs.length) {
      this.toolHandler.chooseColourApplicator(this.colorService.color[ToolConstants.PRIMARY_COLOUR_INDEX],
         this.colorService.color[ToolConstants.SECONDARY_COLOUR_INDEX], );
    }
  }

  @HostListener('document:keydown.s', ['$event']) onKeydownSEvent(): void {
    if (!this.dialog.openDialogs.length) {
      this.toolHandler.chooseSelector();
    }
  }

  // TODO: test these methods
  @HostListener('document:keydown.control.z', ['$event']) onKeydownZEvent(): void {
    if (!this.dialog.openDialogs.length) {
      this.toolHandler.undo();
    }
  }

  @HostListener('document:keydown.control.shift.z', ['$event']) onKeydownCtrlShiftZEvent(): void {
    if (!this.dialog.openDialogs.length) {
      this.toolHandler.redo();
    }
  }

  @HostListener('document:keydown.control.o', ['$event']) onKeydownHandler(event: KeyboardEvent): void {
    event.preventDefault();
    this.confirmNewDrawing();
  }

  @HostListener('document:keydown.1', ['$event']) onKeydown1(): void {
    if (!this.dialog.openDialogs.length) {
      this.toolHandler.chooseRectangle();
    }
  }

  @HostListener('document:keydown.2', ['$event']) onKeydown2(): void {
    if (!this.dialog.openDialogs.length) {
      this.toolHandler.chooseEllipse();
    }
  }

  confirmNewDrawing(): void {
    if (!this.dialog.openDialogs.length) {
      if (!this.toolHandler.drawings.length) {
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

  openChooseColorDialog(): void {
    this.dialog.open(ColorPickerComponent, {
      panelClass: 'choose-color-window',
    });
  }

  switchColours(): void {
    this.colorService.switchColors();
    if (!this.toolHandler.colourApplicatorSelected) {
      this.toolHandler.resetSelection();
    }
  }
}
