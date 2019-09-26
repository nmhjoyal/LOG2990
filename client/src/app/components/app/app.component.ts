import { Component, HostListener, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ModalWindowComponent } from 'src/app/drawing-view/components/modal-window/modal-window.component';
import { NewDrawingWindowComponent } from 'src/app/drawing-view/components/new-drawing-window/new-drawing-window.component';
import { ModalData } from 'src/app/drawing-view/components/NewDrawingModalData';
import { Message } from '../../../../../common/communication/message';
import { IndexService } from '../../services/index/index.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  readonly title: string = 'LOG2990';
  message = new BehaviorSubject<string>('');

  @HostListener('document:keydown.control.o', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    event.preventDefault();
    if (this.dialog.openDialogs.length < 1) {
      this.openNewDrawingDialog();
    }

  }

  constructor(private basicService: IndexService, public dialog: MatDialog, public dialogRef: MatDialogRef<ModalWindowComponent>,
              @Inject(MAT_DIALOG_DATA) public data: ModalData) {
    this.basicService.basicGet()
      .pipe(
        map((message: Message) => `${message.title} ${message.body}`),
      )
      .subscribe(this.message);
  }

  openNewDrawingDialog(): void {
    this.dialog.open(NewDrawingWindowComponent, {
      data: NewDrawingWindowComponent.prototype.data,
      panelClass: 'new-drawing-window',
    });
  }

}
