import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';

import { ColorPickerComponent } from './color-picker.component';
import { ColorPaletteComponent } from './color-palette/color-palette.component';


@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatFormFieldModule],
  declarations: [ColorPickerComponent, ColorPaletteComponent],
  exports: [ColorPickerComponent],
})
export class ColorPickerModule { }