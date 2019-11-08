import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ColourService } from '../../../services/colour_service/colour.service';
import { ModalWindowComponent } from '../modal-windows/modal-window/modal-window.component';
import { IColourPickerModalData } from './IColourPickerModalData';

@Component({
  selector: 'app-colour-picker',
  templateUrl: './colour-picker.component.html',
  styleUrls: ['./colour-picker.component.scss'],
})

export class ColourPickerComponent extends ModalWindowComponent {
  constructor(public colourService: ColourService,
              public dialogRef: MatDialogRef<ModalWindowComponent>,
              @Inject(MAT_DIALOG_DATA) public data: IColourPickerModalData) {
    super(dialogRef, data);
  }

}
