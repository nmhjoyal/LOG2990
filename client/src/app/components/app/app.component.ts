import { Component, OnInit} from '@angular/core';
import { MatDialog } from '@angular/material';
import {BehaviorSubject} from 'rxjs';
import {map} from 'rxjs/operators';
import { WelcomeWindowComponent } from 'src/app/drawing-view/components/welcome-window/welcome-window.component';
import { LocalStorageService } from 'src/app/services/local_storage/LocalStorageService';
import {Message} from '../../../../../common/communication/message';
import {IndexService} from '../../services/index/index.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  readonly title: string = 'LOG2990';
  readonly welcomeScreenActivatedCookie = 'welcomeScreenActivated';
  message = new BehaviorSubject<string>('');
  popupActivated: boolean;

  constructor(private basicService: IndexService, public dialog: MatDialog,
              private storage: LocalStorageService) {
    this.basicService.basicGet()
      .pipe(
        map((message: Message) => `${message.title} ${message.body}`),
      )
      .subscribe(this.message);
  }

  ngOnInit() {
    this.openWelcomeScreen();
  }

  openWelcomeScreen() {
    const showAgain = this.storage.getShowAgain();
    if (showAgain) {
      this.dialog.open(WelcomeWindowComponent, {
        data: { storage : this.storage },
        disableClose: true,
        panelClass: 'background',
      });
    }
  }
}
