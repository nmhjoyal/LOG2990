import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { ColorPickerModule } from './color-picker/color-picker.module';

@NgModule({
  imports:      [ BrowserModule, ColorPickerModule, FormsModule, ReactiveFormsModule ],
  declarations: [ AppComponent],
  providers: [],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
