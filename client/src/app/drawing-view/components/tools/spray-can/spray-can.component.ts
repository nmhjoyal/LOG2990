import { Component, OnInit, Input, HostListener, OnDestroy } from '@angular/core';
import ClickHelper from 'src/app/helpers/click-helper/click-helper';
import { Id } from '../assets/constants/tool-constants';
import { SaveService } from 'src/app/services/save-service/save.service';
import { AttributesService } from '../assets/attributes/attributes.service';
import { ISprayCan, ISprays } from '../assets/interfaces/spray-can-interface';
import { SprayCanConstants } from '../assets/constants/spray-can-constants';
import { ColourService } from 'src/app/services/colour_service/colour.service';

@Component({
  selector: 'app-spray-can',
  templateUrl: './spray-can.component.html',
  styleUrls: ['./spray-can.component.scss']
})
export class SprayCanComponent implements OnDestroy, OnInit {

  @Input() windowHeight: number;
  @Input() windowWidth: number;

  private sprayTimer: number;
  private sprayCan : ISprayCan;
  private mouseX: number;
  private mouseY: number;
  private isMouseDown: boolean;
  diametre: number;
  sprayPerSecond: number;

  constructor( private saveService: SaveService, private attributeService: AttributesService, private colourService: ColourService ) {
    this.isMouseDown = false;
    this.mouseY = 0;
    this.mouseX = 0;
    this.diametre = SprayCanConstants.DEFAULT_DIAMETRE;
    this.sprayPerSecond = SprayCanConstants.DEFAULT_SPRAY_PER_SECOND;
    this.sprayCan = {
      id: Id.SPRAY_CAN,
      sprays: [],
      radius: 0,
      primaryColour: this.colourService.getPrimaryColour(), // TODO: add opacity
      x: 0,
      y: 0,
      furthestX: 0,
      furthestY: 0,
      width: this.diametre,
      height: this.diametre,
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
    this.sprayCan.width = this.sprayCan.height = this.diametre;
    this.mouseY = ClickHelper.getYPosition(event);
    this.mouseX = ClickHelper.getXPosition(event);
    this.sprayCan.y = this.mouseY - this.sprayCan.radius;
    this.sprayCan.x = this.mouseX - this.sprayCan.radius;
    this.addSpray();
    this.sprayTimer = window.setInterval(() => this.addSpray(), 
      SprayCanConstants.ONE_SECOND / this.sprayPerSecond);
  }

  @HostListener('mousemove', ['$event']) onMouseMove(event: MouseEvent): void {
    if( this.isMouseDown ) {
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
      this.isMouseDown = false
    }
  }

  private getRandomInt(): number {
    return Math.floor(Math.random() * (1000 - 1) + 1);
  }

  private addSpray(): void {
    const position: ISprays = {
      cx: this.mouseX,
      cy: this.mouseY,
      seed: this.getRandomInt(),
    }
    this.sprayCan.sprays.push(position);
    this.calculateDimensions();
  }

  private calculateDimensions(): void {
    this.sprayCan.x = Math.min(this.mouseX - this.sprayCan.radius, this.sprayCan.x);
    this.sprayCan.y = Math.min(this.mouseY - this.sprayCan.radius, this.sprayCan.y);

    const widthCalculation = Math.abs(this.sprayCan.x - this.mouseX) + this.sprayCan.radius;
    const heightCalculation = Math.abs(this.sprayCan.y - this.mouseY) + this.sprayCan.radius;
    this.sprayCan.width = Math.max(this.sprayCan.width, widthCalculation);
    this.sprayCan.height = Math.max(this.sprayCan.height, heightCalculation);
  }

  increaseValue(mode: number): void {
    mode ? this.diametre += SprayCanConstants.DIAMETRE_STEP : this.sprayPerSecond += 1;
  }

  decreaseValue(mode: number): void {
    if (mode === 0  && this.diametre > SprayCanConstants.DIAMETRE_STEP) {
      this.diametre -= SprayCanConstants.DIAMETRE_STEP;
    } else if (mode === 1 && this.sprayPerSecond > 1) {
      this.sprayPerSecond -= 1
    }

  }

}
