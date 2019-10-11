import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ColorService } from '../../../services/color_service/color.service';
import { ColorPickerModalData } from '../ColorPickerModalData';
import { ModalWindowComponent } from '../modal-window/modal-window.component';

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss'],
})

export class ColorPickerComponent extends ModalWindowComponent {
  constructor(public colorService: ColorService,
              public dialogRef: MatDialogRef<ModalWindowComponent>,
              @Inject(MAT_DIALOG_DATA) public data: ColorPickerModalData) {
    super(dialogRef, data);
  }

}
