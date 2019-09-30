import { Component, HostListener, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LocalStorageService } from 'src/app/services/local_storage/LocalStorageService';
import { AppConstants } from 'src/AppConstants';
import { ModalWindowComponent } from '../modal-window/modal-window.component';
import { NewDrawingModalData } from '../NewDrawingModalData';

@Component({
  selector: 'app-new-drawing-window',
  templateUrl: './new-drawing-window.component.html',
  styleUrls: ['./new-drawing-window.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class NewDrawingWindowComponent extends ModalWindowComponent implements OnInit {
  widthInput = new FormControl('', [Validators.maxLength(5), Validators.pattern('^[1-9][0-9]*$'), ]);
  heightInput = new FormControl('', [Validators.maxLength(5), Validators.pattern('^[1-9][0-9]*$'), ]);
  colourInput = new FormControl('', [Validators.pattern('^#[0-9a-f]{6}$'), ]);

  constructor(public dialogRef: MatDialogRef<NewDrawingWindowComponent>,
              @Inject(MAT_DIALOG_DATA) public data: NewDrawingModalData,
              private storage: LocalStorageService) {
    super(dialogRef, data);
    this.reinitializeDrawingVariables();
    dialogRef.disableClose = true;
  }

  @HostListener('window: resize', ['$event']) updateWindowSize() {
    if (!this.data.drawingHeightInput && !this.data.drawingWidthInput) {
      this.data.drawingWidthPreview = window.innerWidth - AppConstants.SIDEBAR_WIDTH;
      this.data.drawingHeightPreview = window.innerHeight - AppConstants.TITLEBAR_WIDTH;
    }
  }

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    this.onClose();
  }

  ngOnInit() {
    this.data.title = 'Créer un nouveau dessin';
    this.data.drawingWidthPreview = window.innerWidth - AppConstants.SIDEBAR_WIDTH;
    this.data.drawingHeightPreview = window.innerHeight - AppConstants.TITLEBAR_WIDTH;
  }

  onAcceptClick(): void {
    this.data.drawingHeightInput ? this.data.drawingHeight = this.data.drawingHeightInput
      : this.data.drawingHeight = this.data.drawingHeightPreview;
    this.data.drawingWidthInput ? this.data.drawingWidth = this.data.drawingWidthInput
      : this.data.drawingWidth = this.data.drawingWidthPreview;
    this.data.drawingColorInput ? this.data.drawingColor = this.data.drawingColorInput :
      this.data.drawingColor = '#ffffff';
    this.data.canvasIsDrawnOn = false;
    this.storage.clear();
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
