import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { LocalStorageService } from '../../../services/local_storage/LocalStorageService';
import { WelcomeWindowComponent } from '../welcome-window/welcome-window.component';


@Component({
  selector: 'app-title-bar',
  templateUrl: './title-bar.component.html',
  styleUrls: ['./title-bar.component.scss'],
})
export class TitleBarComponent implements OnInit {

  constructor(public dialog: MatDialog, private storage: LocalStorageService) { }

  ngOnInit() {
    this.openWelcomeScreen();
  }

  openWelcomeScreen() {
    const showAgain = this.storage.getShowAgain();
    if (showAgain) {
      this.dialog.open(WelcomeWindowComponent, {
        data: { storage : this.storage },
        disableClose: true,
      });
    }
  }

}
