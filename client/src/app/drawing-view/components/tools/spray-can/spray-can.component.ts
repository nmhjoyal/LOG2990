import { Component, OnInit, Input, HostListener, OnDestroy } from '@angular/core';
import ClickHelper from 'src/app/helpers/click-helper/click-helper';
import { Id } from '../assets/constants/tool-constants';
import { SaveService } from 'src/app/services/save-service/save.service';
import { ITools } from '../assets/interfaces/itools';

interface ISpray {
  cx: number;
  cy: number;
}

interface ISprayCan extends ITools {
  sprays: ISpray[];
  radius: number;
  filter: string;
  primaryColour: string;
}

interface IFilterData {

}

@Component({
  selector: 'app-spray-can',
  templateUrl: './spray-can.component.html',
  styleUrls: ['./spray-can.component.scss']
})
export class SprayCanComponent implements OnDestroy, OnInit {

  @Input() windowHeight: number;
  @Input() windowWidth: number;

  private sprayTimer: number;
  private sprayData : ISprayCan;
  private mouseEventBuffer: MouseEvent;
  private isMouseDown: boolean;
  radius: number;
  sprayingTimeout: number;
  sprayCanFilter: IFilterData;

  constructor( private saveService: SaveService ) { // put attributes service and colour service
    this.isMouseDown = false;
    this.radius = 40 // 'default radius'
    this.sprayingTimeout = 1000; // 'default spray timeout'
    this.sprayData = {
      id: Id.SPRAY_CAN,
      sprays: [],
      filter: '',
      radius: 0,
      primaryColour: 'black',
      x: 0,
      y: 0,
      width: 0, 
      height: 0,
    }
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {

  }

  @HostListener('mousedown', ['$event']) onMouseDown(event: MouseEvent ): void {
    this.isMouseDown = true;
    this.mouseEventBuffer = event; // or load x and y on each event?
    this.sprayTimer = window.setInterval(() => this.addSpray(), this.sprayingTimeout);
  }

  @HostListener('mousemove', ['$event']) onMouseMove(event: MouseEvent): void {
    if( this.isMouseDown ) { // how to not fire mousemove handler as often?
      this.mouseEventBuffer = event;
    }
  }

  @HostListener('mouseup', ['$event']) onMouseUp(): void {
    if (this.isMouseDown) {
      clearInterval(this.sprayTimer);
      this.sprayData.radius = this.radius;
      this.saveService.saveDrawing({...this.sprayData});
      this.sprayData.sprays = [];
      this.isMouseDown = false
    }
  }

  addSpray(): void {
    let position: ISpray = {
      cx: ClickHelper.getXPosition(this.mouseEventBuffer),
      cy: ClickHelper.getYPosition(this.mouseEventBuffer),
    }
    this.sprayData.sprays.push(position);
  }

}
