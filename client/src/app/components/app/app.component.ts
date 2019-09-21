import { Component, OnInit} from '@angular/core';
import { MatDialog } from '@angular/material';
import {CookieService} from 'ngx-cookie-service';
import {BehaviorSubject} from 'rxjs';
import {map} from 'rxjs/operators';
import { WelcomeWindowComponent } from 'src/app/drawing-view/components/welcome-window/welcome-window.component';
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
              private cookie: CookieService) {
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
    const cookieExists = this.cookie.check(this.welcomeScreenActivatedCookie);
    if (cookieExists) {
      const cookieVal = this.cookie.get(this.welcomeScreenActivatedCookie);
      this.popupActivated = (cookieVal === 'true') ? true : false;
    } else {
      this.cookie.set(this.welcomeScreenActivatedCookie, 'true');
      this.popupActivated = true;
    }

    if (this.popupActivated) {
      this.dialog.open(WelcomeWindowComponent, {
        data: { cookie : this.cookie },
        disableClose: true,
        panelClass: 'background',
      });
    }
  }
}
