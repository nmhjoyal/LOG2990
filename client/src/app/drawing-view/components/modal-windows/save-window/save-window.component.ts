import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Strings } from 'src/AppConstants/Strings';
import { ModalWindowComponent } from '../modal-window/modal-window.component';
import { ISaveModalData } from './ISaveModalData';

@Component({
  selector: 'app-save-window',
  templateUrl: './save-window.component.html',
  styleUrls: ['./save-window.component.scss'],
})
export class SaveWindowComponent extends ModalWindowComponent implements OnInit {

  constructor(dialogRef: MatDialogRef<SaveWindowComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ISaveModalData) {
    super(dialogRef, data);
    this.data.title = Strings.SAVE_WINDOW_TITLE;
  }

  ngOnInit() {
    //
  }

}
