import { Component, OnInit } from '@angular/core';
import {ModalWindowComponent} from '../modal-window/modal-window.component';

@Component({
  selector: 'app-new-drawing-window',
  templateUrl: './new-drawing-window.component.html',
  styleUrls: ['./new-drawing-window.component.scss'],
})
export class NewDrawingWindowComponent implements OnInit {

  constructor() {
    print();
   }

  ngOnInit() {
    print();
  }

  createNewDrawing(height: number, width: number) {
    print();
  }

}
