import { Component, OnInit, Input, HostListener, OnDestroy, ViewChild } from '@angular/core';
import ClickHelper from 'src/app/helpers/click-helper/click-helper';
import { Id } from '../assets/constants/tool-constants';
import { SaveService } from 'src/app/services/save-service/save.service';
import { ITools } from '../assets/interfaces/itools';
import { AttributesService } from '../assets/attributes/attributes.service';

interface ISprays {
  cx: number;
  cy: number;
  seed: number;
}

export interface ISprayCanOptions {
  wasSaved: boolean;
  savedDiametre: number;
  savedSprayPerSecond: number;
}

export interface ISprayPaint {
  sprays?: ISprays[];
  radius?: number;
}

export interface ISprayCan extends ITools {
  sprays: ISprays[];
  radius: number;
  primaryColour: string;
}

@Component({
  selector: 'app-spray-can',
  templateUrl: './spray-can.component.html',
  styleUrls: ['./spray-can.component.scss']
})
export class SprayCanComponent implements OnDestroy, OnInit {

  @Input() windowHeight: number;
  @Input() windowWidth: number;
  /* TODO: find a way to make the filter look at it's SourceGraphic data to set it's seed in the turbulence filter. 
  * Could a directive handle that? or make a filter for every spraypatch?
   * TODO: write tests*/
//  @ViewChild('sprayCanFilter', { static: false }) test: SVGFilterElement;

  private sprayTimer: number;
  private sprayCan : ISprayCan;
  private mouseX: number;
  private mouseY: number;
  private isMouseDown: boolean;
  protected filterSeed: number;
  diametre: number;
  sprayPerSecond: number;
  onesecond: number = 1000; // TODO: remove this and put as constant

  constructor( private saveService: SaveService, private attributeService: AttributesService ) { // TODO: put colour service
    this.isMouseDown = false;
    this.mouseY = 0;
    this.mouseX = 0;
    this.diametre = 40 // TODO: 'default radius'
    this.sprayPerSecond = 10; // TODO: default spray per second remove this and put as constant
    this.filterSeed = 0;
    this.sprayCan = {
      id: Id.SPRAY_CAN,
      sprays: [],
      radius: 0,
      primaryColour: 'black', // TODO: placeholder. add opacity remove this and put as constant
      x: 0,
      y: 0,
      width: 0, 
      height: 0,
    }
  }

  ngOnInit(): void {
    if (this.attributeService.sprayCanAttributes.wasSaved) {
      this.diametre = this.attributeService.sprayCanAttributes.savedDiametre;
      this.sprayPerSecond = this.attributeService.sprayCanAttributes.savedSprayPerSecond;
    }
  }

  ngOnDestroy(): void {
    this.attributeService.sprayCanAttributes.savedDiametre = this.diametre; 
    this.attributeService.sprayCanAttributes.savedSprayPerSecond = this.sprayPerSecond;
    this.attributeService.sprayCanAttributes.wasSaved = true;
  }

  @HostListener('mousedown', ['$event']) onMouseDown(event: MouseEvent ): void {
    this.isMouseDown = true;
    this.sprayCan.radius = this.diametre/2;
    this.mouseY = ClickHelper.getYPosition(event);
    this.mouseX = ClickHelper.getXPosition(event);
    this.addSpray();
    this.sprayTimer = window.setInterval(() => this.addSpray(), this.onesecond / this.sprayPerSecond);
  }

  @HostListener('mousemove', ['$event']) onMouseMove(event: MouseEvent): void {
    if( this.isMouseDown ) { // how to not fire mousemove handler as often?
      this.mouseY = ClickHelper.getYPosition(event);
      this.mouseX = ClickHelper.getXPosition(event);
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
      this.saveService.saveDrawing({...this.sprayCan});
      this.sprayCan.sprays = [];
      this.mouseY = 0;
      this.mouseX = 0;
      console.log(this.saveService.drawingStorage.drawings);
      this.isMouseDown = false
    }
  }

  getRandomInt(): number {
    return Math.floor(Math.random() * (1000 - 1) + 1);
  }

  addSpray(): void {
    this.filterSeed = this.getRandomInt();
    let position: ISprays = {
      cx: this.mouseX,
      cy: this.mouseY,
      seed: this.getRandomInt(),
    }
    this.sprayCan.sprays.push(position);
  }

  increaseValue(mode: number): void {
    if (mode === 0 ) {
      this.diametre += 5;
    } else if (mode === 1) {
      this.sprayPerSecond += 1
    }
  }

  decreaseValue(mode: number): void {
    if (mode === 0  && this.diametre > 5) {
      this.diametre -= 5; // const diametre step
    } else if (mode === 1 && this.sprayPerSecond > 1) {
      this.sprayPerSecond -= 1
    }

  }

}
