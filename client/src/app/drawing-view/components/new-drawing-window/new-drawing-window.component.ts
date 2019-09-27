import { Component, HostListener, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AppConstants } from 'src/AppConstants';
import { ModalWindowComponent } from '../modal-window/modal-window.component';
import { ModalData } from '../NewDrawingModalData';

@Component({
  selector: 'app-new-drawing-window',
  templateUrl: './new-drawing-window.component.html',
  styleUrls: ['./new-drawing-window.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class NewDrawingWindowComponent extends ModalWindowComponent implements OnInit {
  widthInput = new FormControl('', [Validators.required, Validators.maxLength(4), Validators.pattern('^[1-9][0-9]*$'), ]);
  heightInput = new FormControl('', [Validators.required, Validators.maxLength(4), Validators.pattern('^[1-9][0-9]*$'), ]);
  colourInput = new FormControl('', [Validators.required, Validators.pattern('^#[0-9a-f]{6}$'), ]);

  constructor(public dialogRef: MatDialogRef<NewDrawingWindowComponent>,
              @Inject(MAT_DIALOG_DATA) public data: ModalData) {
    super(dialogRef, data);
    dialogRef.disableClose = true;
  }

  @HostListener('window: resize', ['$event']) updateWindowSize(event?: Event) {
    if (!this.data.drawingHeightInput && !this.data.drawingWidthInput) {
      this.data.drawingWidth = window.innerWidth;
      this.data.drawingHeight = window.innerHeight;
    }
  }

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    this.reinitializeDrawingVariables();
    this.dialogRef.close();
  }

  ngOnInit() {
    this.data.title = 'Créer un nouveau dessin';
  }

  onAcceptClick(): void {
    this.data.drawingHeightInput ? this.data.drawingHeight = this.data.drawingHeightInput
      : this.data.drawingHeight = window.innerHeight - AppConstants.TITLEBAR_WIDTH;
    this.data.drawingWidthInput ? this.data.drawingWidth = this.data.drawingWidthInput
      : this.data.drawingWidth = window.innerWidth - AppConstants.SIDEBAR_WIDTH;
    this.data.drawingColorInput ? this.data.drawingColor = this.data.drawingColorInput :
      this.data.drawingColor = '#ffffff';
    this.dialogRef.close();
    this.reinitializeDrawingVariables();
    this.data.canvasIsDrawnOn = false;
  }

  onCloseClick(): void {
    if (this.data.drawingHeightInput || this.data.drawingWidthInput || this.data.drawingColorInput) {
      if (this.confirmExit()) {
        this.dialogRef.close();

        this.reinitializeDrawingVariables();
      } else {
        return;
      }
    } else {
      this.reinitializeDrawingVariables();
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
