import { Component, HostListener, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { CanvasInformationService } from 'src/app/services/canvas-information/canvas-information.service';
import { IndexService } from 'src/app/services/index/index.service';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
import { Strings } from 'src/AppConstants/Strings';
import { IDrawing } from '../../../../../../../common/drawing-information/IDrawing';
import { ISVGPreview } from '../../../../../../../common/drawing-information/ISVGPreview';
import { ITag } from '../../../../../../../common/drawing-information/ITag';
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
  private drawing: object[];

  constructor(dialogRef: MatDialogRef<SaveWindowComponent>, @Inject(MAT_DIALOG_DATA) public data: ISaveModalData,
    protected canvasData: CanvasInformationService, protected toolHandler: ToolHandlerService, protected index: IndexService) {
    super(dialogRef, data, canvasData, undefined, toolHandler, index);
    this.data.title = Strings.SAVE_WINDOW_TITLE;
    this.data.displayedTags = [];
  }

  @HostListener('document:keydown.enter', ['$event']) onKeydownHandler(event: KeyboardEvent): void {
    event.preventDefault();
  }

  ngOnInit(): void {
    // tslint:disable-next-line: no-any
    this.preview = 'this is a drawing' as any;
    this.drawing = this.toolHandler.drawings;
  }

  onAcceptClick(): void {
    let test: IDrawing;
    const date = new Date().toLocaleDateString();
    test = { name: this.name, preview: this.preview, timestamp: date, shapes: this.drawing };
    this.data.displayedTags.forEach((tag) => {
      if (tag.isSelected) {
        if (!test.tags) {
          test.tags = [];
        }
        test.tags.push(tag);
        this.index.saveTag(tag);
      }
    });

    this.index.saveDrawing(test).subscribe(
      (response: boolean) => {
        if (response) {
          console.log('Saved');
        } else {
          console.log('Failed to save');
        }
      });

    this.onClose();
  }

  addTag(newTag: string): void {
    if (newTag) {
      this.data.displayedTags.push({ name: newTag, isSelected: true });
    }
  }

  clickOnTag(tag: ITag): void {
    tag.isSelected = !tag.isSelected;
  }

  onClose(): void {
    this.dialogRef.close();
  }

}
