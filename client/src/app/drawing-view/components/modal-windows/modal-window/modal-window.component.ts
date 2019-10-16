import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CanvasInformationService } from 'src/app/services/canvas-information/canvas-information.service';
import { IModalData } from './IModalData';

@Component({
  selector: 'app-modal-window',
  templateUrl: './modal-window.component.html',
  styleUrls: ['./modal-window.component.scss'],
})
export abstract class ModalWindowComponent {

  constructor(
    protected dialogRef: MatDialogRef<ModalWindowComponent>,
    @Inject(MAT_DIALOG_DATA) protected data: IModalData,
    protected canvasData: CanvasInformationService) {

  }

  onClose(): void {
    this.dialogRef.close();
  }

}
