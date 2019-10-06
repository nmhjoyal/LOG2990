import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IModalData } from '../ModalData';

@Component({
  selector: 'app-modal-window',
  templateUrl: './modal-window.component.html',
  styleUrls: ['./modal-window.component.scss'],
})
export abstract class ModalWindowComponent implements OnInit {

  constructor(
    protected dialogRef: MatDialogRef<ModalWindowComponent>,
    @Inject(MAT_DIALOG_DATA) protected data: IModalData) {

  }

  onClose(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    console.log('ModalWindowComponent initialized');
  }

}
