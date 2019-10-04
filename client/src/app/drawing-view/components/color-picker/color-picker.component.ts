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

  chooseColor(primary: boolean): void  {
    this.colorService.chooseColor(primary);
    /*
    if (primary) {
      if (!this.data.mainColor) {this.data.mainColor = true;
      }
    } else {
      if (this.data.mainColor) {this.data.mainColor = false;
      }
    }*/
  }

  switchColors(): void {
    this.colorService.switchColors();
    /*
    const intermediateColor = this.data.color[0];
    this.data.color[0] = this.data.color[1];
    this.data.color[1] = intermediateColor;
    */
  }

  setAlpha(alpha: number): void  {
    this.colorService.setAlpha(alpha);/*
    this.data.alpha[+this.data.mainColor] = alpha;
    this.setColor(this.lastColors[9]);*/
  }

  setColor(color: string ): void  {
    this.colorService.setColor(color);
    // this.data.color[+this.data.mainColor] = color;
  }

}
