import { Component, OnInit, OnDestroy } from '@angular/core';
import { StrokeAbstract } from '../../assets/abstracts/stroke-abstract/stroke-abstract';
import { SaveService } from 'src/app/services/save-service/save.service';
import { AttributesService } from '../../assets/attributes/attributes.service';
import { ColourService } from 'src/app/services/colour_service/colour.service';
import { IPen, IComplexPath } from '../../assets/interfaces/drawing-tool-interface';
import { ToolConstants } from '../../assets/constants/tool-constants';
import ClickHelper from 'src/app/helpers/click-helper/click-helper';
import { NumericalValues } from 'src/AppConstants/NumericalValues';

@Component({
  selector: 'app-plume',
  templateUrl: './plume.component.html',
  styleUrls: ['./plume.component.scss']
})
export class PlumeComponent extends StrokeAbstract implements OnInit, OnDestroy {

  private plume: IPen;
  private lineLenght: number;
  private angle: number;
  private lastX: number;
  private lastY: number;

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
    this.lineLenght = ToolConstants.DEFAULT_LINELENGHT;
    this.angle = ToolConstants.DEFAULT_ANGLE;
    this.lastX = 0;
    this.lastY = 0;
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

      this.calculatePath(x, y);
      this.lastX = x;
      this.lastY = y;
    }
  }

  protected updatePositionAndDimensions(x: number, y: number): void {
    this.plume.x = x < this.plume.x ? x : this.plume.x;
    this.plume.y = y < this.plume.y ? y : this.plume.y;
    this.plume.width = x > this.plume.width ? x : this.plume.width;
    this.plume.height = y > this.plume.height ? y : this.plume.height;
  }

  protected calculatePath(x: number, y: number): void {
    const angleRad = this.degreeToRad(this.angle);
    const offsetX = (x > this.lastX) ? x - this.lastX : this.lastX - x;
    const offsetY = (y > this.lastY) ? y - this.lastY : this.lastY - y;
    const angleBetweenPoints = Math.atan(offsetY / offsetX);
    const distance = this.calculatePerpendicularDistance(offsetX, offsetY, angleRad, angleBetweenPoints);
    if (distance > ToolConstants.DEFAULT_STROKE_WIDTH) {
      this.fillGaps(angleBetweenPoints, distance);
    } else {
      this.addPath(x, y);
    }
  }

  protected addPath(x: number, y: number) {
    const angleRad = this.degreeToRad(this.angle);
    const x1 = x - (this.lineLenght / 2) * Math.cos(angleRad);
    const x2 = x + (this.lineLenght / 2) * Math.cos(angleRad);
    const y1 = y - (this.lineLenght / 2) * Math.sin(angleRad);
    const y2 = y + (this.lineLenght / 2) * Math.sin(angleRad);
    const path: IComplexPath = {
      path: 'M' + x1 + ' ' + y1 + 'L' + x2 + ' ' + y2,
      pathWidth: ToolConstants.DEFAULT_STROKE_WIDTH,
    };
    this.plume.points += ' ' + x + ',' + y;
    if (this.plume.paths) {
      this.plume.paths.push(path);
    }
    this.updatePositionAndDimensions(x, y);
  }

  protected calculatePerpendicularDistance(offsetX: number, offsetY: number, angleRad: number, angleBetweenPoints: number): number {
    const incidentAngle = angleBetweenPoints - angleRad;
    return Math.sqrt(offsetX * offsetX + offsetY * offsetY) * Math.sin(incidentAngle);
  }

  protected fillGaps(angleBetweenPoints: number, distance: number): void {
    let x = this.lastX;
    let y = this.lastY;
    for (let i = 0; i < Math.abs(distance) / 2; i++) {
      x += 2 * Math.cos(angleBetweenPoints);
      y += 2 * Math.sin(angleBetweenPoints);
      this.addPath(x, y);
    }
  }

  protected saveShape(): void {
    const currentDrawing: IPen = {
      id: this.plume.id,
      paths: this.plume.paths,
      colour: this.plume.colour,
      strokeLinecap: this.plume.strokeLinecap,
      x: this.plume.x,
      y: this.plume.y,
      width: this.plume.width - this.plume.x,
      height: this.plume.height - this.plume.y,
      points: this.plume.points,
    };
    this.drawingStorage.saveDrawing(currentDrawing);
  }

  protected increaseLineLenght(): void {
    this.lineLenght++;
  }

  protected decreaseLineLenght(): void {
    if (this.lineLenght > 1) {
      this.lineLenght--;
    }
  }

  protected increaseAngle(increment: number): void {
    this.angle += increment;
  }

  protected decreaseAngle(decrement: number): void {
    this.angle -= decrement;
  }

  protected degreeToRad(angle: number): number {
    let angleRad = angle * (Math.PI / NumericalValues.ONE_EIGHTY);
    while (angleRad > 2 * Math.PI) {
      angleRad -= 2 * Math.PI;
    }
    while (angleRad < 0) {
      angleRad += 2 * Math.PI;
    }
    return angleRad;
  }
}
