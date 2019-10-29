import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Subscription } from 'rxjs';
import { CanvasInformationService } from 'src/app/services/canvas-information/canvas-information.service';
import { DrawingStorageService } from 'src/app/services/drawing-storage/drawing-storage.service';
import { IndexService } from 'src/app/services/index/index.service';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
import { Strings } from 'src/AppConstants/Strings';
import { IDrawing } from '../../../../../../../../common/drawing-information/IDrawing';
import { ITag } from '../../../../../../../../common/drawing-information/ITag';
import { ModalWindowComponent } from '../../modal-window/modal-window.component';
import { SaveWindowComponent } from '../../save-window/save-window.component';
import { IGalleryModalData } from './IGalleryModalData';

@Component({
  selector: 'app-gallery-window',
  templateUrl: './gallery-window.component.html',
  styleUrls: ['./gallery-window.component.scss'],
})
export class GalleryWindowComponent extends ModalWindowComponent implements OnInit, OnDestroy {

  private gallerySubscription: Subscription;
  protected drawingsInGallery: IDrawing[];
  private selectedDrawing: IDrawing;
  private drawingToOpen: IDrawing;
  @Input() filterBy: string[] = ['all'];
  isFinishedLoading: boolean;

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
    this.isFinishedLoading = false;

    this.index.getTags().subscribe(
      (response: ITag[]) => {
        if (response) {
          this.data.filterTags = response;
        } else {
          this.data.filterTags = [];
        }
      },
    );
  }

  ngOnInit() {
    this.index.getDrawings().subscribe(
      (response: IDrawing[]) => {
        this.drawingsInGallery = response;
        this.isFinishedLoading = true;
      });
  }

  ngOnDestroy(): void {
    if (this.gallerySubscription) {
      this.gallerySubscription.unsubscribe();
    }
  }

  onSelect(drawing: IDrawing): void {
    this.selectedDrawing = drawing;
  }

  onAcceptClick(): void {

    if (this.selectedDrawing) {
      this.index.getDrawing(this.selectedDrawing).subscribe(
        (response: IDrawing) => {
          if (response) {
            this.drawingToOpen = response;
            this.toolHandler.drawings = this.drawingToOpen.shapes;
            this.canvasData.data = this.drawingToOpen.canvas;
          } else {
            confirm('Le dessin n\'a pu être ouvert. Veuillez en sélectionner un autre.');
          }
        });
    }

    this.onClose();
  }

  tagSelected(tagSelected: string): void {
    if (tagSelected === 'all') {
      this.filterBy = ['all'];
    } else {
      let arr = this.filterBy.slice();
      if (this.filterBy.includes('all')) {
        arr = [];
      }
      const index = arr.indexOf(tagSelected);
      // tslint:disable-next-line:no-magic-numbers
      if (index > -1) {
        arr.splice(index, 1);
      } else {
        arr.push(tagSelected);
      }
      this.filterBy = arr;
    }
  }

  addTag(tag: string): void {
    if (tag) {
      this.tagSelected(tag);
    }
    if (!this.data.filterTags.some((currentTag) => currentTag.name === tag)) {
      confirm('Il n\'y a pas de dessin avec cette étiquette');
    }
  }
}