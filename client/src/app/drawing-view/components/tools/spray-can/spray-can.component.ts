import { Component, OnInit, Input, HostListener, OnDestroy } from '@angular/core';
import ClickHelper from 'src/app/helpers/click-helper/click-helper';
import { Id } from '../assets/constants/tool-constants';
import { SaveService } from 'src/app/services/save-service/save.service';
import { ITools } from '../assets/interfaces/itools';
import { AttributesService } from '../assets/attributes/attributes.service';

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
  diametre: number;
  sprayPerSecond: number
  onesecond: number = 1000; // remove this and put as constant
  sprayCanFilter: IFilterData;

  constructor( private saveService: SaveService, private attributeService: AttributesService ) { // put attributes service and colour service
    this.isMouseDown = false;
    this.diametre = 80 // 'default radius'
    this.sprayPerSecond = 1; // default spray per second
    this.sprayData = {
      id: Id.SPRAY_CAN,
      sprays: [],
      filter: '',
      radius: 0,
      primaryColour: 'black', // placeholder. add opacity
      x: 0,
      y: 0,
      width: 0, 
      height: 0,
    }
  }

  ngOnInit(): void {
    if (this.attributeService.polygonAttributes.wasSaved) {
      this.shape.strokeWidth = this.attributeService.polygonAttributes.savedStrokeWidth;
      this.traceMode = this.attributeService.polygonAttributes.savedTraceMode;
      this.shape.verticesNumber = this.attributeService.polygonAttributes.savedVerticesNumber;
    }
    this.setTraceMode(this.traceMode);
  }

  ngOnDestroy(): void {

  }

  @HostListener('mousedown', ['$event']) onMouseDown(event: MouseEvent ): void {
    this.isMouseDown = true;
    this.mouseEventBuffer = event; // or load x and y on each event?
    this.addSpray();
    this.sprayTimer = window.setInterval(() => this.addSpray(), this.onesecond / this.sprayPerSecond); // put constant here
  }

  @HostListener('mousemove', ['$event']) onMouseMove(event: MouseEvent): void {
    if( this.isMouseDown ) { // how to not fire mousemove handler as often?
      this.mouseEventBuffer = event;
    }
  }

  @HostListener('mouseleave') onMouseLeave(): void {
    if( this.isMouseDown ) {
      this.onMouseUp();
    }
  }

  @HostListener('mouseup') onMouseUp(): void {
    if (this.isMouseDown) {
      clearInterval(this.sprayTimer);
      this.sprayData.radius = this.diametre/2;
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

  increaseValue(mode: number): void {
    if (mode === 0 ) {
      this.diametre += 10;
    } else if (mode === 1) {
      this.sprayPerSecond += 1
    }
  }

  decreaseValue(mode: number): void {
    if (mode === 0  && this.diametre > 0) {
      this.diametre -= 10;
    } else if (mode === 1 && this.sprayPerSecond > 1) {
      this.sprayPerSecond += 1
    }

  }

}
