import { Component, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import ClickHelper from 'src/app/helpers/click-helper/click-helper';
import { ColourService } from 'src/app/services/colour_service/colour.service';
import { SaveService } from 'src/app/services/save-service/save.service';
import { AttributesService } from '../assets/attributes/attributes.service';
import { SprayCanConstants } from '../assets/constants/spray-can-constants';
import { Id } from '../assets/constants/tool-constants';
import { ISpray, ISprayCan } from '../assets/interfaces/spray-can-interface';

@Component({
  selector: 'app-spray-can',
  templateUrl: './spray-can.component.html',
  styleUrls: ['./spray-can.component.scss'],
})
export class SprayCanComponent implements OnDestroy, OnInit {

  @Input() windowHeight: number;
  @Input() windowWidth: number;

  private sprayTimer: number;
  private sprayCan: ISprayCan;
  private mouseX: number;
  private mouseY: number;
  private isMouseDown: boolean;
  private diameter: number;
  private sprayPerSecond: number;

  constructor( private saveService: SaveService, private attributeService: AttributesService, private colourService: ColourService ) {
    this.isMouseDown = false;
    this.mouseX = 0;
    this.mouseY = 0;
    this.diameter = SprayCanConstants.DEFAULT_DIAMETER;
    this.sprayPerSecond = SprayCanConstants.DEFAULT_SPRAY_PER_SECOND;
    this.sprayCan = {
      id: Id.SPRAY_CAN,
      sprays: [],
      radius: 0,
      primaryColour: this.colourService.getPrimaryColour(), // TODO: add opacity
      x: 0,
      y: 0,
      width: this.diameter,
      height: this.diameter,
    };
  }

  ngOnInit(): void {
    if (this.attributeService.sprayCanAttributes.wasSaved) {
      this.diameter = this.attributeService.sprayCanAttributes.savedDiameter;
      this.sprayPerSecond = this.attributeService.sprayCanAttributes.savedSprayPerSecond;
    }
  }

  ngOnDestroy(): void {
    this.attributeService.sprayCanAttributes.savedDiameter = this.diameter;
    this.attributeService.sprayCanAttributes.savedSprayPerSecond = this.sprayPerSecond;
    this.attributeService.sprayCanAttributes.wasSaved = true;
  }

  @HostListener('mousedown', ['$event']) onMouseDown(event: MouseEvent ): void {
    this.isMouseDown = true;
    this.sprayCan.radius = this.diameter / 2;
    this.sprayCan.width = this.sprayCan.height = this.diameter;
    this.mouseX = ClickHelper.getXPosition(event);
    this.mouseY = ClickHelper.getYPosition(event);
    this.sprayCan.x = this.mouseX - this.sprayCan.radius;
    this.sprayCan.y = this.mouseY - this.sprayCan.radius;
    this.addSpray();
    this.sprayTimer = window.setInterval(() => this.addSpray(),
      SprayCanConstants.ONE_SECOND / this.sprayPerSecond);
  }

  @HostListener('mousemove', ['$event']) onMouseMove(event: MouseEvent): void {
    if ( this.isMouseDown ) {
      this.mouseX = ClickHelper.getXPosition(event);
      this.mouseY = ClickHelper.getYPosition(event);
    }
  }

  @HostListener('mouseleave') onMouseLeave(): void {
    if ( this.isMouseDown ) {
      this.onMouseUp();
    }
  }

  @HostListener('mouseup') onMouseUp(): void {
    if (this.isMouseDown) {
      clearInterval(this.sprayTimer);
      this.saveService.saveDrawing({...this.sprayCan});
      this.sprayCan.sprays = [];
      this.mouseX = 0;
      this.mouseY = 0;
      this.isMouseDown = false;
    }
  }

  private getRandomInt(): number {
    return Math.floor(Math.random() * (SprayCanConstants.MAX_SEED - 1) + 1);
  }

  private addSpray(): void {
    const position: ISpray = {
      cx: this.mouseX,
      cy: this.mouseY,
      seed: this.getRandomInt(),
    };
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
    mode ? this.diameter += SprayCanConstants.DIAMETER_STEP : this.sprayPerSecond += 1;
  }

  decreaseValue(mode: number): void {
    if (mode === 1  && this.diameter > SprayCanConstants.DIAMETER_STEP) {
      this.diameter -= SprayCanConstants.DIAMETER_STEP;
    } else if (mode === 0 && this.sprayPerSecond > 1) {
      this.sprayPerSecond -= 1;
    }

  }

}
