import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {MatFormFieldModule} from '@angular/material/form-field';

import { ColorPickerComponent } from './color-picker.component';
import { ColorPaletteComponent } from './color-palette/color-palette.component';
import { AppComponent } from '../drawing-view/components/app.component';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatFormFieldModule],
  declarations: [ColorPickerComponent, ColorPaletteComponent, AppComponent],
  exports: [ColorPickerComponent],
})
export class ColorPickerModule {
 }
