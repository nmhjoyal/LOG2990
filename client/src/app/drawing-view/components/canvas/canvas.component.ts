import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit {

  private windowHeight: number;
  private windowWidth: number;

  constructor() { 
    this.updateWindowSize();
  }

  @HostListener('document:keydown.ctrl.o') newDrawing(event: KeyboardEvent, ) {
      // create modal window here
      
  }

  @HostListener('window: resize', ['$event']) updateWindowSize(event?: Event) {
    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerWidth;
  }

  ngOnInit() {
  }

}
