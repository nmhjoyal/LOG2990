import { Component, OnInit, Input, HostListener } from '@angular/core';
import { ITools } from '../assets/interfaces/itools';


interface ISprayCan extends ITools {
  sprays: 'array of interface containing x, y and filter data.
}'


@Component({
  selector: 'app-spray-can',
  templateUrl: './spray-can.component.html',
  styleUrls: ['./spray-can.component.scss']
})
export class SprayCanComponent implements OnInit {

  @Input() windowHeight: number;
  @Input() windowWidth: number;

  private sprayTimer: number;
  protected sprayData : ISprayCan;

  constructor() { 
    this.sprayData = {
      id:,
      sprays: [],
      x: 0,
      y: 0,
      width: 'default radius'
      height: 'default radius'
    }
  }

  ngOnInit() {
  }

  @HostListener('mousedown', ['$event']) whileMouseDown(event: MouseEvent ): void {
    this.sprayTimer = window.setInterval(() => this.addSpray(event), 1000);
  }

  @HostListener('mouseup', ['$event']) onMouseUp(): void {
    clearInterval(this.sprayTimer);
  }

  addSpray(event: MouseEvent): void {

  }

}
