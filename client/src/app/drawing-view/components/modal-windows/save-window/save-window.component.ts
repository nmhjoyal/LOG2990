import { Component, HostListener, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { CanvasInformationService } from 'src/app/services/canvas-information/canvas-information.service';
import { IDrawing } from 'src/app/services/drawing-storage/IDrawing';
import { ISVGPreview } from 'src/app/services/drawing-storage/ISVGPreview';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
import { Strings } from 'src/AppConstants/Strings';
import { ModalWindowComponent } from '../modal-window/modal-window.component';
import { ISaveModalData } from './ISaveModalData';
import { ITag } from './ITag';
@Component({
  selector: 'app-save-window',
  templateUrl: './save-window.component.html',
  styleUrls: ['./save-window.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SaveWindowComponent extends ModalWindowComponent implements OnInit {

  protected nameInput: string;
  protected preview: ISVGPreview;
  private drawing: object[];

  constructor(dialogRef: MatDialogRef<SaveWindowComponent>, @Inject(MAT_DIALOG_DATA) public data: ISaveModalData,
    protected canvasData: CanvasInformationService, protected storage: ToolHandlerService) {
    super(dialogRef, data, canvasData, storage);
    this.data.title = Strings.SAVE_WINDOW_TITLE;
    this.data.displayedTags = [];
  }

  @HostListener('document:keydown.enter', ['$event']) onKeydownHandler(event: KeyboardEvent): void {
    event.preventDefault();
  }

  ngOnInit(): void {
    // tslint:disable-next-line: no-any
    this.preview = 'hello' as any;
    this.drawing = [Object.create(null)];
  }

  onAcceptClick(): void {
    console.log('onaccept called');
    let test: IDrawing;
    const date = new Date().toLocaleDateString();
    test = { name: this.nameInput, preview: this.preview, timestamp: date, shapes: this.drawing };
    this.data.displayedTags.forEach((tag) => {
      if (tag.isSelected) {
        if (!test.tags) {
          test.tags = [];
        }
        test.tags.push(tag);
      }
    });
    this.onClose();
    console.log(test);
  }

  addTag(newTag: string): void {
    if (newTag) {
      this.data.displayedTags.push({ name: newTag, isSelected: true });
    }
    console.log('addtag called');
  }

  clickOnTag(tag: ITag): void {
    tag.isSelected = !tag.isSelected;
  }

  onClose(): void {
    this.dialogRef.close();
  }

}
