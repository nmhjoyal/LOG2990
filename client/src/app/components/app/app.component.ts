import { Component, Type } from '@angular/core';
import { MatDialog } from '@angular/material';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ModalWindowComponent } from 'src/app/drawing-view/components/modal-window/modal-window.component';
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

  constructor(private basicService: IndexService, public dialog: MatDialog) {
    this.basicService.basicGet()
      .pipe(
        map((message: Message) => `${message.title} ${message.body}`),
      )
      .subscribe(this.message);
  }

  openDialog(): void {
    this.dialog.open(ModalWindowComponent as Type<ModalWindowComponent>, {
      width: '800px',
      height: '600px',
      data: { title: '' },
    });
  }
}
