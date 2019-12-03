import { Component, OnDestroy, OnInit } from '@angular/core';
import ClickHelper from 'src/app/helpers/click-helper/click-helper';
import { ColourService } from 'src/app/services/colour_service/colour.service';
import { SaveService } from 'src/app/services/save-service/save.service';
import { StrokeAbstract } from '../../assets/abstracts/stroke-abstract/stroke-abstract';
import { AttributesService } from '../../assets/attributes/attributes.service';
import { ToolConstants } from '../../assets/constants/tool-constants';
import { IComplexPath, IPen } from '../../assets/interfaces/drawing-tool-interface';

@Component({
  selector: 'app-pen',
  templateUrl: './pen.component.html',
  styleUrls: ['./pen.component.scss'],
})
export class PenComponent extends StrokeAbstract implements OnInit, OnDestroy {

  private pen: IPen;
  private speed: number;
  private lastX: number;
  private lastY: number;
  private lastTime: number;
  private maxWidth: number;
  private minWidth: number;
  private newWidth: number;

  constructor(saveServiceRef: SaveService,
              attributesServiceRef: AttributesService,
              colourServiceRef: ColourService) {
    super(saveServiceRef, attributesServiceRef, colourServiceRef);
    this.pen = {
      id: ToolConstants.TOOL_ID.PEN,
      paths: [],
      colour: this.colourService.PrimaryColour,
      strokeLinecap: ToolConstants.ROUND,
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      points: '',
    };
    this.speed = 0;
    this.lastX = 0;
    this.lastY = 0;
    this.lastTime = 0;
    this.maxWidth = ToolConstants.DEFAULT_MAX_WIDTH;
    this.minWidth = ToolConstants.DEFAULT_MIN_WIDTH;
    this.newWidth = ToolConstants.DEFAULT_MAX_WIDTH;
  }

  ngOnInit(): void {
    if (this.attributesService.penAttributes.wasSaved) {
      this.maxWidth = this.attributesService.penAttributes.savedMaxWidth;
      this.minWidth = this.attributesService.penAttributes.savedMinWidth;
      this.newWidth = this.attributesService.penAttributes.savedMaxWidth;
    }
    this.colourService.data.subscribe((colour: string[]) => {
      this.pen.colour = colour[0];
    });
  }

  ngOnDestroy(): void {
    this.saveAttribute();
  }

  saveAttribute(): void {
    this.attributesService.penAttributes.wasSaved = true;
    this.attributesService.penAttributes.savedMaxWidth = this.maxWidth;
    this.attributesService.penAttributes.savedMinWidth = this.minWidth;
  }

  onMouseDown(event: MouseEvent): void {
    this.mouseDown = true;
    this.lastTime = Date.now();
    this.lastX = ClickHelper.getXPosition(event);
    this.lastY = ClickHelper.getYPosition(event);
    this.pen.x = this.lastX;
    this.pen.y = this.lastY;
    this.pen.width = 0;
    this.pen.height = 0;
    this.pen.points = this.lastX + ',' + this.lastY;
  }

  onMouseMove(event: MouseEvent): void {
    if (this.mouseDown) {
      const x = ClickHelper.getXPosition(event);
      const y = ClickHelper.getYPosition(event);
      if (x !== this.lastX || y !== this.lastY) {
        this.speed = this.calculateSpeed(x, y, Date.now());
        this.lastTime = Date.now();

        const interpolation = ((ToolConstants.MAX_SPEED - this.speed) /
                            (ToolConstants.MAX_SPEED - ToolConstants.MIN_SPEED)) *
                            (this.maxWidth - this.minWidth);
        const midWidth = (this.maxWidth - this.minWidth) / 2;
        if (interpolation < midWidth) {
          if (this.newWidth - ToolConstants.STROKE_INCREMENT >= this.minWidth) {
            this.newWidth -= ToolConstants.STROKE_INCREMENT;
          }
        } else {
          if (this.newWidth + ToolConstants.STROKE_INCREMENT <= this.maxWidth) {
            this.newWidth += ToolConstants.STROKE_INCREMENT;
          }
        }
        this.addPath(x, y);
        this.lastX = x;
        this.lastY = y;
      }
    }
  }

  onMouseUp(): void {
    this.saveShape();
    this.mouseDown = false;
    this.pen.paths = [];
    this.pen.points = '';
  }

  protected decreaseMinWidth(): void {
    if (this.minWidth > 1) {
      this.minWidth--;
    }
  }

  protected increaseMinWidth(): void {
    if (this.minWidth < this.maxWidth) {
      this.minWidth++;
    }
  }

  protected decreaseMaxWidth(): void {
    if (this.maxWidth > this.minWidth) {
      this.maxWidth--;
    }
  }

  protected increaseMaxWidth(): void {
    if (this.maxWidth + 1 <= ToolConstants.MAX_STROKE_WIDTH) {
      this.maxWidth++;
    }
  }

  protected calculateSpeed(x: number, y: number, time: number): number {
    return Math.sqrt(Math.pow(x - this.lastX, 2) + Math.pow(y - this.lastY, 2)) / (time - this.lastTime);
  }

  protected addPath(x: number, y: number): void {
    const path: IComplexPath = {
      path: 'M' + this.lastX + ' ' + this.lastY + 'L' + x + ' ' + y,
      pathWidth: this.newWidth,
    };
    this.pen.points += ' ' + x + ',' + y;
    if (this.pen.paths) {
      this.pen.paths.push(path);
    }
    this.updatePositionAndDimensions(x, y);
  }

  protected updatePositionAndDimensions(x: number, y: number): void {
    this.pen.x = x < this.pen.x ? x : this.pen.x;
    this.pen.y = y < this.pen.y ? y : this.pen.y;
    this.pen.width = x > this.pen.width ? x : this.pen.width;
    this.pen.height = y > this.pen.height ? y : this.pen.height;
  }

  protected saveShape(): void {
    const currentDrawing: IPen = {
      id: this.pen.id,
      paths: this.pen.paths,
      colour: this.pen.colour,
      strokeLinecap: this.pen.strokeLinecap,
      x: this.pen.x,
      y: this.pen.y,
      width: this.pen.width - this.pen.x,
      height: this.pen.height - this.pen.y,
      points: this.pen.points,
    };
    this.drawingStorage.saveDrawing(currentDrawing);
  }
}
