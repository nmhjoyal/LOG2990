import { Component, OnInit, Input, HostListener } from '@angular/core';
import { ITools } from '../assets/interfaces/itools';
import ClickHelper from 'src/app/helpers/click-helper/click-helper';
// import { SaveService } from 'src/app/services/save-service/save.service';

interface ISpray {
  cx: number;
  cy: number;
}

interface ISprayCan extends ITools {
  sprays: ISpray[];
  filter: string;
}

interface IFilterData {

}

@Component({
  selector: 'app-spray-can',
  templateUrl: './spray-can.component.html',
  styleUrls: ['./spray-can.component.scss']
})
export class SprayCanComponent implements OnInit {

  @Input() windowHeight: number;
  @Input() windowWidth: number;

  private sprayTimer: number;
  private sprayData : ISprayCan;
  private mouseEventBuffer: MouseEvent;
  private isMouseDown: boolean;
  sprayingTimeout: number;
  sprayCanFilter: IFilterData;

  constructor() { // private saveService: SaveService
    this.isMouseDown = false;
    this.sprayingTimeout = 1000; // 'default spray timeout'
    this.sprayData = {
      id:'spray',
      sprays: [],
      filter: '',
      x: 0,
      y: 0,
      width: 10, // 'default radius'
      height: 10, // 'default radius'
    }
  }

  ngOnInit() {
  }

  @HostListener('mousedown', ['$event']) onMouseDown(event: MouseEvent ): void {
    this.isMouseDown = true;
    this.mouseEventBuffer = event; // or load x and y on each event?
    this.sprayTimer = window.setInterval(() => this.addSpray(), 1000);
  }

  @HostListener('mousemove', ['$event']) onMouseMove(event: MouseEvent): void {
    if( this.isMouseDown ) { // how to not fire mousemove handler as often?
      this.mouseEventBuffer = event;
    }
  }

  @HostListener('mouseup', ['$event']) onMouseUp(): void {
    if (this.isMouseDown) {
      clearInterval(this.sprayTimer);
      this.saveSpray({...this.sprayData});
      this.sprayData.sprays.length = 0;
    }
  }

  addSpray(): void {
    let position: ISpray = {
      cx: ClickHelper.getXPosition(this.mouseEventBuffer),
      cy: ClickHelper.getYPosition(this.mouseEventBuffer),
    }
    this.sprayData.sprays.push(position);
  }

  saveSpray( sprayData: ISprayCan){
    console.log(sprayData.sprays);
    //this.saveService.saveDrawing(sprayData);
  }

}
