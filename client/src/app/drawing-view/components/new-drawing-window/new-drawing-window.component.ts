import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ModalWindowComponent } from '../modal-window/modal-window.component';
import { ModalData } from '../ModalData';

@Component({
  selector: 'app-new-drawing-window',
  templateUrl: './new-drawing-window.component.html',
  styleUrls: ['./new-drawing-window.component.scss'],
})
export class NewDrawingWindowComponent extends ModalWindowComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ModalWindowComponent>,
              @Inject(MAT_DIALOG_DATA) public data: ModalData) {
    super(dialogRef, data);
  }

  @HostListener('window: resize', ['$event']) updateWindowSize(event?: Event) {
    this.data.defaultWidth = window.innerWidth;
    this.data.defaultHeight = window.innerHeight;
  }

  ngOnInit() {
    this.data.title = 'Create a new drawing';
    this.data.defaultHeight = window.innerHeight;
    this.data.defaultWidth = window.innerWidth;

    console.log();
  }

  createNewDrawing(height: number, width: number) {
    console.log();
  }

  onAcceptClick(): void {
    console.log();
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }

}
