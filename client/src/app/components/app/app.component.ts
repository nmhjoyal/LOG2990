import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { WelcomeWindowComponent } from 'src/app/drawing-view/components/welcome-window/welcome-window.component';
import { LocalStorageService } from 'src/app/services/local_storage/LocalStorageService';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

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
