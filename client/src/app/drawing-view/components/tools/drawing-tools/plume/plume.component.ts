import { Component, OnInit, OnDestroy } from '@angular/core';
import { StrokeAbstract } from '../../assets/abstracts/stroke-abstract/stroke-abstract';
import { SaveService } from 'src/app/services/save-service/save.service';
import { AttributesService } from '../../assets/attributes/attributes.service';
import { ColourService } from 'src/app/services/colour_service/colour.service';
import { IPen, IComplexPath } from '../../assets/interfaces/drawing-tool-interface';
import { ToolConstants } from '../../assets/constants/tool-constants';
import ClickHelper from 'src/app/helpers/click-helper/click-helper';

@Component({
  selector: 'app-plume',
  templateUrl: './plume.component.html',
  styleUrls: ['./plume.component.scss']
})
export class PlumeComponent extends StrokeAbstract implements OnInit, OnDestroy {

  private plume: IPen;
  private lastX: number;
  private lastY: number;
  private lineLenght: number;
  private angle: number;
  private newWidth: number;

  constructor(saveServiceRef: SaveService,
              attributesServiceRef: AttributesService,
              colourServiceRef: ColourService) {
    super(saveServiceRef, attributesServiceRef, colourServiceRef);
    this.plume = {
      id: ToolConstants.TOOL_ID.PLUME,
      paths: [],
      colour: this.colourService.colour[ToolConstants.PRIMARY_COLOUR_INDEX],
      strokeLinecap: ToolConstants.ROUND,
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      points: '',
    };
    this.lastX = 0;
    this.lastY = 0;
    this.lineLenght = 0;
    this.angle = 0;
    this.newWidth = ToolConstants.DEFAULT_MAX_WIDTH;
  }

  ngOnInit(): void {
    if (this.attributesService.plumeAttributes.wasSaved) {
      this.lineLenght = this.attributesService.plumeAttributes.savedLineLenght;
      this.angle = this.attributesService.plumeAttributes.savedAngle;
    }
  }

  ngOnDestroy(): void {
    this.saveAttribute();
  }

  saveAttribute(): void {
    this.attributesService.plumeAttributes.wasSaved = true;
    this.attributesService.plumeAttributes.savedLineLenght = this.lineLenght;
    this.attributesService.plumeAttributes.savedAngle = this.angle;
  }

  onMouseDown(event: MouseEvent): void {
    this.mouseDown = true;
    this.lastX = ClickHelper.getXPosition(event);
    this.lastY = ClickHelper.getYPosition(event);
    this.plume.x = this.lastX;
    this.plume.y = this.lastY;
    this.plume.width = 0;
    this.plume.height = 0;
    this.plume.points = this.lastX + ',' + this.lastY;
  }

  onMouseMove(event: MouseEvent): void {
    if (this.mouseDown) {
      const x = ClickHelper.getXPosition(event);
      const y = ClickHelper.getYPosition(event);
      if (x !== this.lastX || y !== this.lastY) {
        const multiplier = this.calculateWidthMultiplier(x, y);
        this.newWidth = ToolConstants.DEFAULT_MAX_WIDTH * multiplier;
        this.addPath(x, y);
        this.lastX = x;
        this.lastY = y;
      }
    }
  }

  calculateWidthMultiplier(x: number, y: number) {
    const offsetX = x > this.lastX ? x - this.lastX : this.lastX - x;
    const offsetY = y > this.lastY ? y - this.lastY : this.lastY - y;
    const orientationRad = Math.abs(Math.atan(offsetY / offsetX) - Math.PI);
    return  orientationRad > Math.PI / 2 ? (orientationRad - (Math.PI / 2)) / (Math.PI / 2) : orientationRad / (Math.PI / 2);
  }

  protected updatePositionAndDimensions(x: number, y: number): void {
    this.plume.x = x < this.plume.x ? x : this.plume.x;
    this.plume.y = y < this.plume.y ? y : this.plume.y;
    this.plume.width = x > this.plume.width ? x : this.plume.width;
    this.plume.height = y > this.plume.height ? y : this.plume.height;
  }

  protected addPath(x: number, y: number): void {
    const path: IComplexPath = {
      path: 'M' + this.lastX + ' ' + this.lastY + 'L' + x + ' ' + y,
      pathWidth: this.newWidth,
    };
    this.plume.points += ' ' + x + ',' + y;
    if (this.plume.paths) {
      this.plume.paths.push(path);
    }
    this.updatePositionAndDimensions(x, y);
  }
}
