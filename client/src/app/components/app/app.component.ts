import {Component} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {map} from 'rxjs/operators';
import {Message} from '../../../../../common/communication/message';
import {IndexService} from '../../services/index/index.service';
import { MatDialog } from '@angular/material';
import { ModalWindowComponent } from 'src/app/drawing-view/components/modal-window/modal-window.component';
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

  constructor(private basicService: IndexService, public dialog: MatDialog) {
    this.basicService.basicGet()
      .pipe(
        map((message: Message) => `${message.title} ${message.body}`),
      )
      .subscribe(this.message);
  }

  openDialog(): void {
    this.dialog.open(ModalWindowComponent, {
      width: '800px',
      height: '600px'
    });
  }
}
