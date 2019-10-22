import { Component, Inject, OnInit, Input, OnDestroy } from '@angular/core';
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
import { ITag } from '../../../../../../../../common/drawing-information/ITag';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-gallery-window',
  templateUrl: './gallery-window.component.html',
  styleUrls: ['./gallery-window.component.scss'],
})
export class GalleryWindowComponent extends ModalWindowComponent implements OnDestroy, OnInit {

  private gallerySubscription: Subscription;
  protected drawingsInGallery: IDrawing[];
  private selectedDrawing: IDrawing;
  private drawingToOpen: IDrawing;
  @Input() filterBy?: string = 'all'


  constructor(dialogRef: MatDialogRef<SaveWindowComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IGalleryModalData,
    protected canvasData: CanvasInformationService,
    protected drawingData: DrawingStorageService,
    protected toolHandler: ToolHandlerService, protected index: IndexService) {
    super(dialogRef, data, canvasData, undefined, toolHandler, drawingData, index);
    this.data.title = Strings.GALLERY_WINDOW_TITLE;
    this.drawingsInGallery = [];
    this.selectedDrawing = {} as IDrawing;
    this.drawingToOpen = {} as IDrawing;

    this.index.getTags().subscribe(
      (response: ITag[]) => {
        if (response) {
          this.data.filterTags = response;
        } else {
          this.data.filterTags = [];
        }
      }
    )
  }

  ngOnInit(): void {
    this.gallerySubscription = this.index.getDrawings().subscribe(
      (response: IDrawing[]) => {
        this.drawingsInGallery = response;
      });
  }

  ngOnDestroy(): void {
    this.gallerySubscription.unsubscribe();
  }

  onSelect(drawing: IDrawing): void {
    console.log('Drawing selected');
    this.selectedDrawing = drawing;
  }

  onAcceptClick(): void {

    if (this.selectedDrawing) {
      this.index.getDrawing(this.selectedDrawing).subscribe(
        (response: IDrawing) => {
          if (response) {
            this.drawingToOpen = response;
            // TODO: Open drawing
            console.log('Opening drawing name: ' + this.drawingToOpen.name + ', timestamp: ' + this.drawingToOpen.timestamp + '.');
            this.toolHandler.drawings = this.drawingToOpen.shapes;
            this.canvasData.data = this.drawingToOpen.canvas;
          } else {
            // TODO: Show the error to the user
            console.error('Drawing not found (name: ' + this.selectedDrawing.name +
              ', timestamp: ' + this.selectedDrawing.timestamp + ').');
          }
        });
    }

    this.onClose();
  }

}
