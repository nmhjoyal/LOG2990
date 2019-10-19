import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { CanvasInformationService } from 'src/app/services/canvas-information/canvas-information.service';
import { DrawingStorageService } from 'src/app/services/drawing-storage/drawing-storage.service';
import { IndexService } from 'src/app/services/index/index.service';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
import { Strings } from 'src/AppConstants/Strings';
import { IDrawing } from '../../../../../../../../common/drawing-information/IDrawing';
import { ModalWindowComponent } from '../../modal-window/modal-window.component';
import { SaveWindowComponent } from '../../save-window/save-window.component';
import { IGalleryModalData } from './IGalleryModalData';

@Component({
  selector: 'app-gallery-window',
  templateUrl: './gallery-window.component.html',
  styleUrls: ['./gallery-window.component.scss'],
})
export class GalleryWindowComponent extends ModalWindowComponent implements OnInit {

  constructor(dialogRef: MatDialogRef<SaveWindowComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IGalleryModalData,
    protected canvasData: CanvasInformationService,
    protected drawingData: DrawingStorageService,
    protected toolHandler: ToolHandlerService, protected index: IndexService) {
    super(dialogRef, data, canvasData, undefined, toolHandler, drawingData, index);
    this.data.title = Strings.GALLERY_WINDOW_TITLE;
  }

  drawingsInGallery: IDrawing[] = [];

  ngOnInit() {
    this.index.getDrawings().subscribe(
      (response: IDrawing[]) => {
        this.drawingsInGallery = response;
      });
  }

}
