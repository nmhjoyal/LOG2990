import { Component, HostListener, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ModalWindowComponent } from 'src/app/drawing-view/components/modal-window/modal-window.component';
import { ModalData } from 'src/app/drawing-view/components/ModalData';
// import { ModalWindowComponent } from 'src/app/drawing-view/components/modal-window/modal-window.component';
import { NewDrawingWindowComponent } from 'src/app/drawing-view/components/new-drawing-window/new-drawing-window.component';
import { Message } from '../../../../../common/communication/message';
import { IndexService } from '../../services/index/index.service';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  // animations: [BrowserAnimationsModule],
})
export class AppComponent {
  readonly title: string = 'LOG2990';
  message = new BehaviorSubject<string>('');
  private windowHeight: number;
  private windowWidth: number;

  @HostListener('document:keydown.ctrl.i') handleKeyboardEvent(event: KeyboardEvent) {
    // create modal window here
    const newDrawing = new NewDrawingWindowComponent(this.dialogRef, this.data);
    newDrawing.createNewDrawing(this.windowHeight, this.windowWidth);
    console.log('new');
  }

  constructor(private basicService: IndexService, public dialog: MatDialog, public dialogRef: MatDialogRef<ModalWindowComponent>,
              @Inject(MAT_DIALOG_DATA) public data: ModalData) {
    this.basicService.basicGet()
      .pipe(
        map((message: Message) => `${message.title} ${message.body}`),
      )
      .subscribe(this.message);
  }

  openDialog(): void {
    this.dialog.open(NewDrawingWindowComponent, {
      width: '800px',
      height: '600px',
      data: { title: 'Template' },
    });
  }

}
