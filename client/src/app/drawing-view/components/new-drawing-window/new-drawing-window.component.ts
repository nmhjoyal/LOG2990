import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ModalWindowComponent } from '../modal-window/modal-window.component';
import { ModalData } from '../NewDrawingModalData';

@Component({
  selector: 'app-new-drawing-window',
  templateUrl: './new-drawing-window.component.html',
  styleUrls: ['./new-drawing-window.component.scss'],
})
export class NewDrawingWindowComponent extends ModalWindowComponent implements OnInit {
  widthInput = new FormControl(this.data.drawingWidth, [Validators.min(1), Validators.pattern('^[0-9]*$'), ]);
  heightInput = new FormControl(this.data.drawingHeight, [Validators.min(1), Validators.pattern('^[0-9]*$'), ]);
  colourInput = new FormControl(this.data.drawingBackgroundColor, [Validators.pattern('^#[0-9a-f]{6}$'), ]);

  constructor(public dialogRef: MatDialogRef<ModalWindowComponent>,
              @Inject(MAT_DIALOG_DATA) public data: ModalData) {
    super(dialogRef, data);
    dialogRef.disableClose = true;
  }

  @HostListener('window: resize', ['$event']) updateWindowSize(event?: Event) {
    if (!this.data.drawingHeight && !this.data.drawingWidth) {
      this.data.defaultWidth = window.innerWidth;
      this.data.defaultHeight = window.innerHeight;
    }
  }

  ngOnInit() {
    this.data.title = 'Create a new drawing';
    this.data.defaultHeight = window.innerHeight;
    this.data.defaultWidth = window.innerWidth;
  }

  createNewDrawing(): void {
    // create mock svg here
  }

  onAcceptClick(): void {
    if (!this.widthInput.hasError && !this.heightInput.hasError && !this.colourInput.hasError) {
      this.dialogRef.close();
    } else {
      confirm('There are errors in the form. Please fix them before continuing.');
    }
  }

  onCloseClick(): void {
    if (this.data.drawingHeight || this.data.drawingWidth || this.data.drawingBackgroundColor) {
      if (this.confirmExit()) {
        this.dialogRef.close();
      }
    } else {
      this.dialogRef.close();
    }

  }

  confirmExit() {
    return confirm('Are you sure you want to exit and lose your changes?');
  }
}
