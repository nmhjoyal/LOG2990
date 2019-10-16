import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { CanvasInformationService } from 'src/app/services/canvas-information/canvas-information.service';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
import { Strings } from 'src/AppConstants/Strings';
import { ModalWindowComponent } from '../modal-window/modal-window.component';
import { IWelcomeWindowData } from './IWelcomeWindowData';

@Component({
  selector: 'app-welcome-window',
  templateUrl: './welcome-window.component.html',
  styleUrls: ['./welcome-window.component.scss'],
})

export class WelcomeWindowComponent extends ModalWindowComponent {
  isChecked: boolean;

  constructor(dialogRef: MatDialogRef<WelcomeWindowComponent>,
              @Inject(MAT_DIALOG_DATA) protected data: IWelcomeWindowData,
              protected canvasData: CanvasInformationService,
              protected storage: ToolHandlerService) {
    super(dialogRef, data, canvasData, storage);
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
