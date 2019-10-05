import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ModalWindowComponent } from '../modal-window/modal-window.component';
import { IWelcomeWindowData } from './WelcomeWindowData';

@Component({
  selector: 'app-welcome-window',
  templateUrl: './welcome-window.component.html',
  styleUrls: ['./welcome-window.component.scss'],
})

export class WelcomeWindowComponent extends ModalWindowComponent {
  isChecked: boolean;

  constructor(public dialogRef: MatDialogRef<WelcomeWindowComponent>,
              @Inject(MAT_DIALOG_DATA) public data: IWelcomeWindowData) {
    super(dialogRef, data);
    this.isChecked = false;
  }

  checkboxClicked(): void {
    this.isChecked = !this.isChecked;
  }

  onClose(): void {
    super.onClose();
    if (this.isChecked && this.data.storage !== undefined) {
      this.data.storage.setShowAgain(false);
    }
  }
}
