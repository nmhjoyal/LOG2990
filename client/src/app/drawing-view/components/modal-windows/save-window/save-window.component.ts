import { Component, HostListener, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { CanvasInformationService } from 'src/app/services/canvas-information/canvas-information.service';
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

  constructor(dialogRef: MatDialogRef<SaveWindowComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ISaveModalData, protected canvasData: CanvasInformationService) {
    super(dialogRef, data, canvasData);
    this.data.title = Strings.SAVE_WINDOW_TITLE;
    this.data.displayedTags = [];
  }

  @HostListener('document:keydown.enter', ['$event']) onKeydownHandler(event: KeyboardEvent): void {
    event.preventDefault();
  }

  ngOnInit(): void {
// initialize preview here so time is used more efficiently
  }

  onAcceptClick(): void {
    //
  }

  addTag(newTag: string): void {
    if (newTag) {
      this.data.displayedTags.push({ name: newTag, isSelected: true });
    }
  }

  clickOnTag(tag: ITag): void {
    tag.isSelected = !tag.isSelected;
  }

}