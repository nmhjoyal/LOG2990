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
  /* TODO: find a way to make the filter look at it's SourceGraphic data to set it's seed in the turbulence filter. 
  * To prevent saturating the canvashtml with filters.
  */

  private sprayTimer: number;
  private sprayCan : ISprayCan;
  private mouseX: number;
  private mouseY: number;
  private isMouseDown: boolean;
  protected filterSeed: number;
  diametre: number;
  sprayPerSecond: number;

  constructor( private saveService: SaveService, private attributeService: AttributesService, private colourService: ColourService ) {
    this.isMouseDown = false;
    this.mouseY = 0;
    this.mouseX = 0;
    this.diametre = SprayCanConstants.DEFAULT_DIAMETRE;
    this.sprayPerSecond = SprayCanConstants.DEFAULT_SPRAY_PER_SECOND;
    this.filterSeed = 0;
    this.sprayCan = {
      id: Id.SPRAY_CAN,
      sprays: [],
      radius: 0,
      primaryColour: this.colourService.getPrimaryColour(), // TODO: add opacity
      x: 0,
      y: 0,
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
      this.diametre += SprayCanConstants.DIAMETRE_STEP;
    } else if (mode === 1) {
      this.sprayPerSecond += 1
    }
  }

  decreaseValue(mode: number): void {
    if (mode === 0  && this.diametre > SprayCanConstants.DIAMETRE_STEP) {
      this.diametre -= SprayCanConstants.DIAMETRE_STEP;
    } else if (mode === 1 && this.sprayPerSecond > 1) {
      this.sprayPerSecond -= 1
    }

  }

}
