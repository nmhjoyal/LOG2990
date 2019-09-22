import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ModalWindowComponent } from '../modal-window/modal-window.component';
import { WelcomeWindowData } from './WelcomeWindowData';

@Component({
  selector: 'app-welcome-window',
  templateUrl: './welcome-window.component.html',
  styleUrls: ['./welcome-window.component.scss'],
})

export class WelcomeWindowComponent extends ModalWindowComponent {
  readonly welcomeScreenActivatedCookie = 'welcomeScreenActivated';
  isChecked: boolean;

  constructor(public dialogRef: MatDialogRef<WelcomeWindowComponent>,
              @Inject(MAT_DIALOG_DATA) public data: WelcomeWindowData) {
    super(dialogRef, data);
    this.isChecked = false;
  }

  onCloseClick(): void {
    super.onCloseClick();
    if (this.isChecked && this.data.storage !== undefined) {
      this.data.storage.setShowAgain(false);
    }
  }
}
