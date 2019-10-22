import { Component, HostListener, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
import { NumericalValues } from 'src/AppConstants/NumericalValues';
import { Strings } from 'src/AppConstants/Strings';
import { ColorService } from '../../../services/color_service/color.service';
import { ModalWindowComponent } from '../modal-window/modal-window.component';
import { INewDrawingModalData } from './INewDrawingModalData';

@Component({
  selector: 'app-new-drawing-window',
  templateUrl: './new-drawing-window.component.html',
  styleUrls: ['./new-drawing-window.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class NewDrawingWindowComponent extends ModalWindowComponent implements OnInit {

  constructor(dialogRef: MatDialogRef<NewDrawingWindowComponent>,
              @Inject(MAT_DIALOG_DATA) public data: INewDrawingModalData,
              public colorService: ColorService,
              private storage: ToolHandlerService) {
    super(dialogRef, data);
    this.data.title = Strings.MODAL_TITLE  ;
    this.data.drawingWidthPreview = window.innerWidth - NumericalValues.SIDEBAR_WIDTH;
    this.data.drawingHeightPreview = window.innerHeight - NumericalValues.TITLEBAR_WIDTH;
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    this.reinitializeDrawingVariables();
  }

  @HostListener('window: resize', ['$event']) updateWindowSize(): void {
    if (!this.data.drawingHeightInput && !this.data.drawingWidthInput) {
      this.data.drawingWidthPreview = window.innerWidth - NumericalValues.SIDEBAR_WIDTH;
      this.data.drawingHeightPreview = window.innerHeight - NumericalValues.TITLEBAR_WIDTH;
    }
  }

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent): void {
    event.preventDefault();
    this.onClose();
  }

  onAcceptClick(): void {
    this.data.drawingHeightInput ? this.data.drawingHeight = this.data.drawingHeightInput
      : this.data.drawingHeight = this.data.drawingHeightPreview;
    this.data.drawingWidthInput ? this.data.drawingWidth = this.data.drawingWidthInput
      : this.data.drawingWidth = this.data.drawingWidthPreview;
    this.data.drawingColorInput ? this.data.drawingColor = this.data.drawingColorInput :
      this.data.drawingColor = Strings.WHITE_HEX;
    this.storage.clearPage();
    this.dialogRef.close();
  }

  onClose(): void {
    if (this.data.drawingHeightInput || this.data.drawingWidthInput || this.data.drawingColorInput) {
      if (this.confirmExit()) {
        this.dialogRef.close();
      }
    } else {
      this.dialogRef.close();
    }
  }

  reinitializeDrawingVariables(): void {
    this.data.drawingColorInput = undefined;
    this.data.drawingHeightInput = undefined;
    this.data.drawingWidthInput = undefined;
  }

  confirmExit(): boolean {
    return confirm(Strings.NEW_DRAWING_CONFIRM);
  }
}
