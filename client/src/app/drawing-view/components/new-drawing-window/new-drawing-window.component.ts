import { Component, HostListener, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AppConstants } from 'src/AppConstants';
import { INewDrawingModalData } from '../INewDrawingModalData';
import { ModalWindowComponent } from '../modal-window/modal-window.component';

@Component({
  selector: 'app-new-drawing-window',
  templateUrl: './new-drawing-window.component.html',
  styleUrls: ['./new-drawing-window.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class NewDrawingWindowComponent extends ModalWindowComponent implements OnInit {
  static MODAL_TITLE = 'Créer un nouveau dessin';

  constructor(dialogRef: MatDialogRef<NewDrawingWindowComponent>,
              @Inject(MAT_DIALOG_DATA) public data: INewDrawingModalData) {
    super(dialogRef, data);
    this.data.title = NewDrawingWindowComponent.MODAL_TITLE  ;
    this.data.drawingWidthPreview = window.innerWidth - AppConstants.SIDEBAR_WIDTH;
    this.data.drawingHeightPreview = window.innerHeight - AppConstants.TITLEBAR_WIDTH;
    dialogRef.disableClose = true;
  }

  ngOnInit() {
    this.reinitializeDrawingVariables();
  }

  @HostListener('window: resize', ['$event']) updateWindowSize() {
    if (!this.data.drawingHeightInput && !this.data.drawingWidthInput) {
      this.data.drawingWidthPreview = window.innerWidth - AppConstants.SIDEBAR_WIDTH;
      this.data.drawingHeightPreview = window.innerHeight - AppConstants.TITLEBAR_WIDTH;
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
      this.data.drawingColor = AppConstants.WHITE_HEX;
    this.data.canvasIsDrawnOn = false;
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
    return confirm('Êtes-vous certain.e de vouloir quitter et perdre vos changements?');
  }
}
