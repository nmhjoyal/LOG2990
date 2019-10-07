import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ColorService } from 'src/app/services/color_service/color.service';
import { ColorPickerModalData } from '../ColorPickerModalData';
import { ModalWindowComponent } from '../modal-window/modal-window.component';

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.css'],
})

export class ColorPickerComponent extends ModalWindowComponent {
  /*color = ['#ffffffff', '#000000ff'];
  lastColors = ['#222222ff', '#333333ff', '#444444ff', '#555555ff', '#777777ff',
                '#aaaaaaff', '#bbbbbbff', '#ccccccff', '#ddddddff', '#eeeeeeff'];
  alpha = [1, 1];
  mainColor = false;
*/
  constructor(private colorService: ColorService,
              public dialogRef: MatDialogRef<ModalWindowComponent>,
              @Inject(MAT_DIALOG_DATA) public data: ColorPickerModalData) {
    super(dialogRef, data);
  }

}
