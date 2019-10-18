import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CanvasInformationService } from 'src/app/services/canvas-information/canvas-information.service';
import { DrawingStorageService } from 'src/app/services/drawing-storage/drawing-storage.service';
import { IndexService } from 'src/app/services/index/index.service';
import { LocalStorageService } from 'src/app/services/local_storage/local-storage-service';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
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
    protected canvasData?: CanvasInformationService,
    protected storage?: LocalStorageService,
    protected toolHandler?: ToolHandlerService,
    protected drawingData?: DrawingStorageService,
    protected index?: IndexService) {

  }

  onClose(): void {
    this.dialogRef.close();
  }

}
