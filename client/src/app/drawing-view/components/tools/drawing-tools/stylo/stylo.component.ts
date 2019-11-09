import { Component, OnDestroy, OnInit } from '@angular/core';
import { ITools } from 'src/app/drawing-view/components/tools/assets/interfaces/itools';
import ClickHelper from 'src/app/helpers/click-helper/click-helper';
import { ColorService } from 'src/app/services/color_service/color.service';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
import { StrokeAbstract } from '../../assets/abstracts/stroke-abstract/stroke-abstract';
import { AttributesService } from '../../assets/attributes/attributes.service';
import { IPath } from '../../assets/interfaces/drawing-tool-interface';
import { ToolConstants } from '../../assets/tool-constants';

@Component({
  selector: 'app-stylo',
  templateUrl: './stylo.component.html',
  styleUrls: ['./stylo.component.scss'],
})
export class StyloComponent extends StrokeAbstract implements OnInit, OnDestroy {

  stylo: ITools;
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
    this.newWidth = ToolConstants.DEFAULT_MAX_WIDTH;
  }

  ngOnInit(): void {
    if (this.attributesService.styloAttributes.wasSaved) {
      this.maxWidth = this.attributesService.styloAttributes.savedMaxWidth;
      this.minWidth = this.attributesService.styloAttributes.savedMinWidth;
      this.newWidth = this.attributesService.styloAttributes.savedMaxWidth;
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

  onMouseDown(event: MouseEvent): void {
    this.mouseDown = true;
    this.lastTime = Date.now();
    this.lastX = ClickHelper.getXPosition(event);
    this.lastY = ClickHelper.getYPosition(event);
    this.stylo.x = this.lastX;
    this.stylo.y = this.lastY;
    this.stylo.width = 0;
    this.stylo.height = 0;
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
          if (interpolation > this.maxWidth) {
            this.newWidth = this.maxWidth;
          } else if (this.newWidth - ToolConstants.STROKE_INCREMENT >= this.minWidth) {
            this.newWidth -= ToolConstants.STROKE_INCREMENT;
          }
        } else if (interpolation > midWidth) {
          if (interpolation < this.minWidth) {
            this.newWidth = this.minWidth;
          } else if (this.newWidth + ToolConstants.STROKE_INCREMENT <= this.maxWidth) {
            this.newWidth += ToolConstants.STROKE_INCREMENT;
          }
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

  protected addPath(x: number, y: number) {
    this.stylo.x = x < this.stylo.x ? x : this.stylo.x;
    this.stylo.y = y < this.stylo.y ? y : this.stylo.y;
    this.stylo.width = x > this.stylo.width ? x : this.stylo.width;
    this.stylo.height = y > this.stylo.height ? y : this.stylo.height;
    const path: IPath = {
      path: 'M ' + this.lastX + ' ' + this.lastY + ' L ' + x + ' ' + y,
      strokeWidth: this.newWidth,
      strokeColour: 'black',
    };
    if (this.stylo.paths !== undefined) {
      this.stylo.paths.push(path);
    }
  }

  protected saveShape(): void {
    const currentDrawing: ITools = {
      id: this.stylo.id,
      paths: this.stylo.paths,
      x: this.stylo.x,
      y: this.stylo.y,
      width: this.stylo.width - this.stylo.x,
      height: this.stylo.height - this.stylo.y,
    };
    this.toolService.drawings.push(currentDrawing);
  }
}
