import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Strings } from 'src/AppConstants/Strings';
import { ModalWindowComponent } from '../modal-window/modal-window.component';
import { IWelcomeWindowData } from './IWelcomeWindowData';

@Component({
  selector: 'app-welcome-window',
  templateUrl: './welcome-window.component.html',
  styleUrls: ['./welcome-window.component.scss'],
})

export class WelcomeWindowComponent extends ModalWindowComponent {
  private isChecked: boolean;

  constructor(dialogRef: MatDialogRef<WelcomeWindowComponent>,
              @Inject(MAT_DIALOG_DATA) protected data: IWelcomeWindowData) {
    super(dialogRef, data);
    this.isChecked = false;
  }

  reverseCheckboxClicked(): void {
    this.isChecked = !this.isChecked;
  }

  onClose(): void {
    super.onClose();
    if (this.isChecked && this.data.storage !== undefined) {
      this.data.storage.setShowAgain(Strings.FALSE);
    }
  }
}
