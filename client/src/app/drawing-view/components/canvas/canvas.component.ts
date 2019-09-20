import { Component, OnInit, HostListener } from '@angular/core';
import { NewDrawingWindowComponent } from '../new-drawing-window/new-drawing-window.component';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss'],
})
export class CanvasComponent implements OnInit {

  private windowHeight: number;
  private windowWidth: number;

  constructor() {
    this.updateWindowSize();
  }

  @HostListener('document:keydown.ctrl.o') handleKeyboardEvent(event: KeyboardEvent) {
    // create modal window here
    const newDrawing = new NewDrawingWindowComponent;
    newDrawing.createNewDrawing(this.windowHeight, this.windowWidth);
  }

  @HostListener('window: resize', ['$event']) updateWindowSize(event?: Event) {
    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerWidth;
  }

  ngOnInit() {
    print();
  }

}
