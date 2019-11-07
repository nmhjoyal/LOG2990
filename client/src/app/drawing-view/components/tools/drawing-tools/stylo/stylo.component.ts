import { Component, OnDestroy, OnInit } from '@angular/core';
import ClickHelper from 'src/app/helpers/click-helper/click-helper';
import { ColorService } from 'src/app/services/color_service/color.service';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
import { StrokeAbstract } from '../../assets/abstracts/stroke-abstract/stroke-abstract';
import { AttributesService } from '../../assets/attributes/attributes.service';
import { IPath, IStylo } from '../../assets/interfaces/drawing-tool-interface';
import { ToolConstants } from '../../assets/tool-constants';

@Component({
  selector: 'app-stylo',
  templateUrl: './stylo.component.html',
  styleUrls: ['./stylo.component.scss'],
})
export class StyloComponent extends StrokeAbstract implements OnInit, OnDestroy {

  stylo: IStylo;
  speed: number;
  lastX: number;
  lastY: number;
  lastTime: number;
  maxWidth: number;
  minWidth: number;
  newWidth: number;

  constructor(toolServiceRef: ToolHandlerService,
              attributesServiceRef: AttributesService,
              colorServiceRef: ColorService) {
    super(toolServiceRef, attributesServiceRef, colorServiceRef);
    this.stylo = {
      id: ToolConstants.TOOL_ID.STYLO,
      paths: [],
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    };
    this.speed = 0;
    this.lastX = 0;
    this.lastY = 0;
    this.lastTime = 0;
    this.maxWidth = ToolConstants.DEFAULT_MAX_WIDTH;
    this.minWidth = ToolConstants.DEFAULT_MIN_WIDTH;
    this.newWidth = this.stroke.strokeWidth;
  }

  ngOnInit(): void {
    if (this.attributesService.styloAttributes.wasSaved) {
      this.maxWidth = this.attributesService.styloAttributes.savedMaxWidth;
      this.minWidth = this.attributesService.styloAttributes.savedMinWidth;
    }
  }

  ngOnDestroy(): void {
    this.saveAttribute();
  }

  saveAttribute(): void {
    this.attributesService.styloAttributes.wasSaved = true;
    this.attributesService.styloAttributes.savedMaxWidth = this.maxWidth;
    this.attributesService.styloAttributes.savedMinWidth = this.minWidth;
  }

  decreaseMinWidth(): void {
    if (this.minWidth > 1) {
      this.minWidth--;
    }
  }

  increaseMinWidth(): void {
    if (this.minWidth < this.maxWidth) {
      this.minWidth++;
    }
  }

  decreaseMaxWidth(): void {
    if (this.maxWidth > this.minWidth) {
      this.maxWidth--;
    }
  }

  increaseMaxWidth(): void {
    this.maxWidth++;
  }

  onMouseDown(event: MouseEvent): void {
    this.mouseDown = true;
    this.lastTime = Date.now();
    this.lastX = ClickHelper.getXPosition(event);
    this.lastY = ClickHelper.getYPosition(event);
  }

  onMouseMove(event: MouseEvent): void {
    if (this.mouseDown) {
      const x = ClickHelper.getXPosition(event);
      const y = ClickHelper.getYPosition(event);
      if (x !== this.lastX && y !== this.lastY) {
        // tslint:disable-next-line: no-magic-numbers
        this.speed = this.calculateSpeed(x, y, Date.now()) * 10;
        this.lastTime = Date.now();

        if (this.speed > ToolConstants.MAX_SPEED) {
          if (this.newWidth - 1 >= this.minWidth) {
            this.newWidth--;
          }
        } else if (this.speed < ToolConstants.MIN_SPEED) {
          if (this.newWidth + 1 <= this.maxWidth) {
            this.newWidth++;
          }
        } else {
          this.newWidth = Math.round(this.minWidth + (this.speed / (ToolConstants.MAX_SPEED - ToolConstants.MIN_SPEED)));
        }
        this.addPath(x, y);
        this.lastX = x;
        this.lastY = y;
        super.onMouseMove(event);
      }
    }
  }

  onMouseUp(): void {
    this.saveShape();
    this.mouseDown = false;
    this.stylo.paths = [];
  }

  protected calculateSpeed(x: number, y: number, time: number): number {
    return Math.sqrt(Math.pow(x - this.lastX, 2) + Math.pow(y - this.lastY, 2)) / (time - this.lastTime);
  }

  protected addPath(x: number, y: number) {
    if (x !== this.lastX && y !== this.lastY) {
      const path: IPath = {
        path: 'M' + this.lastX + ' ' + this.lastY + 'L' + x + ' ' + y,
        strokeWidth: this.newWidth,
        strokeColour: 'black',
      };
      this.stylo.paths.push(path);
    }
  }

  protected saveShape(): void {
    const currentDrawing: IStylo = {
      id: this.stylo.id,
      paths: this.stylo.paths,
      x: this.stroke.x,
      y: this.stroke.y,
      width: this.stroke.width,
      height: this.stroke.height,
    };
    this.toolService.drawings.push(currentDrawing);
  }
}
