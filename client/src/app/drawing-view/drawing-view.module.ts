import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from '../components/app/app.component';
import { GalleryWindowComponent } from './components/modal-windows/gallery-window/gallery-window/gallery-window.component';

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    MatDialogModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    BrowserAnimationsModule,
    MatButtonModule,
  ],
  exports: [
    BrowserModule,
    HttpClientModule,
    MatDialogModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    BrowserAnimationsModule,
    MatButtonModule,
  ],
  providers: [{ provide: MatDialogRef, useValue: {} },
  { provide: MAT_DIALOG_DATA, useValue: [] }, ],
  bootstrap: [AppComponent],
  declarations: [GalleryWindowComponent],
})
export class DrawingViewModule { }
