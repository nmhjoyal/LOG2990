import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { WelcomeWindowComponent } from 'src/app/drawing-view/components/welcome-window/welcome-window.component';
import { LocalStorageService } from 'src/app/services/local_storage/LocalStorageService';
import {DrawViewComponent} from '../../drawing-view/draw-view/draw-view.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  ngOnInit() {
  }

  openWelcomeScreen() {
  }
}
