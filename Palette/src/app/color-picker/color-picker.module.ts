import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ColorPickerComponent } from './color-picker.component';
//import { ColorSliderComponent } from './color-slider/color-slider.component';
import { ColorPaletteComponent } from './color-palette/color-palette.component';
import { ColorInputsComponent } from './color-inputs/color-inputs.component';

@NgModule({
  imports: [CommonModule],
  declarations: [ColorPickerComponent, ColorPaletteComponent, ColorInputsComponent, ColorInputsComponent],
  exports: [ColorPickerComponent],
})
export class ColorPickerModule { }