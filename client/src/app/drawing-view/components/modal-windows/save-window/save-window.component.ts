import { Component, HostListener, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { CanvasInformationService } from 'src/app/services/canvas-information/canvas-information.service';
import { IndexService } from 'src/app/services/index/index.service';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
import { Strings } from 'src/AppConstants/Strings';
import { IDrawing } from '../../../../../../../common/drawing-information/IDrawing';
import { ISVGPreview } from '../../../../../../../common/drawing-information/ISVGPreview';
import { ITag } from '../../../../../../../common/drawing-information/ITag';
import { ITools } from '../../tools/assets/interfaces/itools';
import { ModalWindowComponent } from '../modal-window/modal-window.component';
import { ISaveModalData } from './ISaveModalData';
@Component({
  selector: 'app-save-window',
  templateUrl: './save-window.component.html',
  styleUrls: ['./save-window.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SaveWindowComponent extends ModalWindowComponent implements OnInit {

  protected name: string;
  protected preview: ISVGPreview;
  private drawing: ITools[];
  isFinishedSaving: boolean;

  constructor(dialogRef: MatDialogRef<SaveWindowComponent>, @Inject(MAT_DIALOG_DATA) public data: ISaveModalData,
    protected canvasData: CanvasInformationService, protected toolHandler: ToolHandlerService, protected index: IndexService) {
    super(dialogRef, data, canvasData, undefined, toolHandler, index);
    this.data.title = Strings.SAVE_WINDOW_TITLE;
    this.isFinishedSaving = true;
    this.index.getTags().subscribe(
      (response: ITag[]) => {
        if (response) {
          this.data.displayedTags = response;
        } else {
          this.data.displayedTags = [];
        }
      },
    );
  }

  @HostListener('document:keydown.enter', ['$event']) onKeydownHandler(event: KeyboardEvent): void {
    event.preventDefault();
  }

  ngOnInit(): void {
    this.drawing = this.toolHandler.drawings;
  }

  onAcceptClick(): void {
    let drawingToSave: IDrawing;
    const date = new Date().toLocaleString('en-GB', { timeZone: 'UTC' });
    drawingToSave = { name: this.name, timestamp: date, shapes: this.drawing, canvas: this.canvasData.data };
    this.isFinishedSaving = false;
    this.data.displayedTags.forEach((tag) => {
      if (tag.isSelected) {
        this.clickOnTag(tag);
        if (!drawingToSave.tags) {
          drawingToSave.tags = [];
        }
        drawingToSave.tags.push(tag);
        this.index.saveTag(tag).subscribe(
          (response: boolean) => {
            if (!response) {
              confirm('Il y a eu une erreur lors de la sauvegarde des étiquettes.');
            }
          },
        );
      }
    });

    this.index.saveDrawing(drawingToSave).subscribe(
      (response: boolean) => {
        if (!response) {
          confirm('Il y a eu une erreur lors de la sauvegarde du dessin.');
        }
      });
    this.isFinishedSaving = true;

    this.onClose();
  }

  addTag(newTag: string): void {
    if (newTag) {
      if (!this.data.displayedTags.some((tag) => tag.name === newTag)) {
        this.data.displayedTags.push({ name: newTag, isSelected: true });
      }
    }
  }

  clickOnTag(tag: ITag): void {
    tag.isSelected = !tag.isSelected;
  }

  onClose(): void {
    this.dialogRef.close();
  }

}
