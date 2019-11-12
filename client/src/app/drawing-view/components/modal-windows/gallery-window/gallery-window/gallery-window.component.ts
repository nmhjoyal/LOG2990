import { Component, ElementRef, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Observable } from 'rxjs';
import { CanvasInformationService } from 'src/app/services/canvas-information/canvas-information.service';
import { DrawingStorageService } from 'src/app/services/drawing-storage/drawing-storage.service';
import { ClientStorageService } from 'src/app/services/index/client-storage.service';
import { Strings } from 'src/AppConstants/Strings';
import { IDrawing } from '../../../../../../../../common/drawing-information/IDrawing';
import { ITag } from '../../../../../../../../common/drawing-information/ITag';
import { ModalWindowComponent } from '../../modal-window/modal-window.component';
import { IGalleryModalData } from './IGalleryModalData';

@Component({
  selector: 'app-gallery-window',
  templateUrl: './gallery-window.component.html',
  styleUrls: ['./gallery-window.component.scss'],
})

export class GalleryWindowComponent extends ModalWindowComponent implements OnInit {

  @ViewChild('fileInput', { read: false, static: false }) fileInput: ElementRef;

  protected drawingsInGallery: IDrawing[] | undefined;
  private selectedDrawing: IDrawing | undefined;
  private drawingToOpen: IDrawing;
  @Input() filterBy: string[] = ['all'];
  isFinishedLoading: boolean;

  constructor(dialogRef: MatDialogRef<GalleryWindowComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IGalleryModalData,
    protected canvasData: CanvasInformationService,
    protected drawingStorage: DrawingStorageService,
    protected index: ClientStorageService) {
    super(dialogRef, data, canvasData, undefined, undefined, drawingStorage, undefined, undefined, index);
    this.data.title = Strings.GALLERY_WINDOW_TITLE;
    this.drawingsInGallery = [];
    this.selectedDrawing = {} as IDrawing;
    this.drawingToOpen = {} as IDrawing;
    this.isFinishedLoading = false;

    this.index.getTags().subscribe(
      (response: ITag[] | undefined) => {
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
      (response: IDrawing[] | undefined) => {
        this.drawingsInGallery = response;
        this.isFinishedLoading = true;
      });
  }

  onSelect(drawing: IDrawing): void {
    this.selectedDrawing = drawing;
  }

  onAcceptClick(): void {
    if (this.selectedDrawing) {
      this.index.getDrawing(this.selectedDrawing).subscribe(
        (response: IDrawing | undefined) => {
          if (response) {
            this.drawingToOpen = response;
            this.drawingStorage.drawings = this.drawingToOpen.shapes;
            this.canvasData.data = this.drawingToOpen.canvas;
            this.onClose();

          } else {
            confirm('Le dessin sélectionné n\'a pu être ouvert. Veuillez en sélectionner un autre.');
          }
        });
    }
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
      // tslint:disable-next-line: no-magic-numbers
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

  loadFile(file: File) {
    return new Observable<string | ArrayBuffer | null>((subscriber) => {
      const fileLoader = new FileReader();
      fileLoader.onload = () => {
        subscriber.next(fileLoader.result);
        subscriber.complete();
      };
      fileLoader.onerror = (error) => {
        subscriber.error(error);
      };
      fileLoader.readAsText(file);
    });

  }

  importLocalFile() {

    this.loadFile(this.fileInput.nativeElement.files[0]).subscribe((fileContent: string) => {
      if (this.fileInput.nativeElement.files[0].name.includes('.json')) {
        const data = JSON.parse(fileContent);
        this.drawingToOpen = data;
        this.drawingStorage.drawings = this.drawingToOpen.shapes;
        this.canvasData.data = this.drawingToOpen.canvas;
        this.onClose();
      } else {
        alert('Veuillez choisir un fichier JSON valide.');
      }

    });
  }

}
